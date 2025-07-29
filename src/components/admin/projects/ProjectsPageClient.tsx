"use client";

import { useState } from "react";
import { AdminHeader } from "~/components/admin/common/AdminHeader";
import { AdminStats } from "~/components/admin/common/AdminStats";
import { AdminFilters } from "~/components/admin/common/AdminFilters";
import ProjectEditor from "~/components/admin/projects/ProjectEditor";
import { ProjectTable } from "~/components/admin/projects/ProjectTable";
import { ProjectDetailsModal } from "~/components/admin/projects/ProjectDetailsModal";
import Modal from "~/components/admin/common/Modal";
import { Pagination } from "~/components/ui/pagination";
import { useToastContext } from "~/components/toast-provider";
import { useQuery } from "@tanstack/react-query";
import AdminTableSkeleton from "~/components/admin/common/AdminTableSkeleton";
import NotFoundInline from "~/components/ui/not-found-inline";

interface Project {
  id: string;
  title: string;
  description: string;
  href?: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  year: number;
  quarterly: string;
  fund?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [showProjectModal, setShowProjectModal] = useState<Project | null>(null);
  const { showSuccess, showError } = useToastContext();

  const {
    data: queryData,
    isLoading: loadingProjects,
    refetch: fetchProjects,
  } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    }
  });

  const projects: Project[] = queryData?.projects || [];

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowEditor(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditor(true);
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    try {
      const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setShowEditor(false);
        setEditingProject(null);
        await fetchProjects();
        showSuccess(
          editingProject ? 'Project updated' : 'Project created',
          editingProject ? 'Project has been updated successfully.' : 'Project has been created successfully.'
        );
      } else {
        showError('Failed to save project');
      }
    } catch (error) {
      showError('Failed to save project');
    }
  };



  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const stats = {
    total: projects.length,
    proposed: projects.filter(p => p.status === 'PROPOSED').length,
    approved: projects.filter(p => p.status === 'APPROVED').length,
    inProgress: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Projects Management" 
        description="Manage Cardano2vn projects and proposals"
        buttonText="Add Project"
        onAddClick={handleCreateProject}
      />

      <AdminStats 
        stats={[
          { label: "Total Projects", value: stats.total },
          { label: "Proposed", value: stats.proposed },
          { label: "Approved", value: stats.approved },
          { label: "In Progress", value: stats.inProgress },
          { label: "Completed", value: stats.completed },
        ]}
      />

      <AdminFilters
        searchTerm={searchTerm}
        filterType={statusFilter}
        searchPlaceholder="Search projects by title or description..."
        filterOptions={[
          { value: "all", label: "All Status" },
          { value: "PROPOSED", label: "Proposed" },
          { value: "APPROVED", label: "Approved" },
          { value: "IN_PROGRESS", label: "In Progress" },
          { value: "COMPLETED", label: "Completed" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
        onSearchChange={setSearchTerm}
        onFilterChange={setStatusFilter}
      />

      {loadingProjects ? (
        <AdminTableSkeleton columns={7} rows={5} />
      ) : filteredProjects.length === 0 ? (
        <NotFoundInline 
          onClearFilters={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <ProjectTable
            projects={paginatedProjects}
            onEdit={handleEditProject}
            onDelete={async (project) => {
              try {
                const response = await fetch(`/api/admin/projects/${project.id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });

                if (response.ok) {
                  await fetchProjects();
                  showSuccess('Project deleted', 'Project has been deleted successfully.');
                } else {
                  showError('Failed to delete project');
                }
              } catch (error) {
                showError('Failed to delete project');
              }
            }}
            onViewDetails={setShowProjectModal}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProjects.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingProject(null);
        }}
        title={editingProject ? "Edit Project" : "Add New Project"}
        maxWidth="max-w-2xl"
      >
        <ProjectEditor
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowEditor(false);
            setEditingProject(null);
          }}
        />
      </Modal>



      <ProjectDetailsModal
        project={showProjectModal}
        isOpen={!!showProjectModal}
        onClose={() => setShowProjectModal(null)}
      />
    </div>
  );
} 