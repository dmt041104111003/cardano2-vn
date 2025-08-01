"use client";

import { useState } from "react";
import { AdminHeader } from "~/components/admin/common/AdminHeader";
import { AdminStats } from "~/components/admin/common/AdminStats";
import { AdminFilters } from "~/components/admin/common/AdminFilters";
import TechnologyEditor from "~/components/admin/technologies/TechnologyEditor";

import { TechnologyTable } from "~/components/admin/technologies/TechnologyTable";
import TechnologyDetailsModal from "~/components/admin/technologies/TechnologyDetailsModal";
import ProjectsPageClient from "~/components/admin/projects/ProjectsPageClient";
import Modal from "~/components/admin/common/Modal";
import { Pagination } from "~/components/ui/pagination";
import { useToastContext } from "~/components/toast-provider";
import { useQuery } from "@tanstack/react-query";
import AdminTableSkeleton from "~/components/admin/common/AdminTableSkeleton";
import NotFoundInline from "~/components/ui/not-found-inline";
import { Technology } from "~/constants/technologies";

export default function TechnologiesPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);

  const [showTechnologyModal, setShowTechnologyModal] = useState<Technology | null>(null);
  const [activeTab, setActiveTab] = useState<'technologies' | 'projects'>('technologies');
  const { showSuccess, showError } = useToastContext();

  const {
    data: queryData,
    isLoading: loadingTechnologies,
    refetch: fetchTechnologies,
  } = useQuery({
    queryKey: ['admin-technologies'],
    queryFn: async () => {
      const res = await fetch('/api/admin/technologies');
      if (!res.ok) throw new Error('Failed to fetch technologies');
      return res.json();
    }
  });

  const technologies: Technology[] = queryData?.technologies || [];

  const {
    data: projectsData,
    isLoading: loadingProjects,
  } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    }
  });

  const projects = projectsData?.projects || [];

  const handleCreateTechnology = () => {
    setEditingTechnology(null);
    setShowEditor(true);
  };

  const handleEditTechnology = (technology: Technology) => {
    setEditingTechnology(technology);
    setShowEditor(true);
  };



  const handleSaveTechnology = async (technologyData: { title: string; name: string; description: string; href: string; image: string }) => {
    try {
      const url = editingTechnology ? `/api/admin/technologies/${editingTechnology.id}` : '/api/admin/technologies';
      const method = editingTechnology ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(technologyData),
      });

      if (response.ok) {
        setShowEditor(false);
        await fetchTechnologies();
        showSuccess(
          editingTechnology ? 'Technology updated' : 'Technology created',
          editingTechnology ? 'Technology has been updated successfully.' : 'Technology has been created successfully.'
        );
      } else {
        showError('Failed to save technology');
      }
    } catch (error) {
      showError('Failed to save technology');
    }
  };





  const filteredTechnologies = technologies.filter(technology => {
    const matchesSearch = technology.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredTechnologies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTechnologies = filteredTechnologies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const stats = {
    total: technologies.length,
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('technologies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'technologies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Projects ({technologies.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Catalyst ({projects.length})
          </button>

        </nav>
      </div>

      {activeTab === 'technologies' ? (
        <>
          <AdminHeader 
            title="Projects Management" 
            description="Manage Cardano2vn projects"
            buttonText="Add Project"
            onAddClick={handleCreateTechnology}
          />
          <AdminStats 
            stats={[
              { label: "Total Projects", value: stats.total },
            ]}
          />

          <AdminFilters
            searchTerm={searchTerm}
            filterType="all"
            searchPlaceholder="Search projects by title, name or description..."
            filterOptions={[
              { value: "all", label: "All Projects" },
            ]}
            onSearchChange={setSearchTerm}
            onFilterChange={() => {}}
          />

          {loadingTechnologies ? (
            <AdminTableSkeleton columns={5} rows={6} />
          ) : filteredTechnologies.length === 0 ? (
            <NotFoundInline 
              onClearFilters={() => {
                setSearchTerm('');
                // setStatusFilter('all'); // This line was not in the new_code, so I'm not adding it.
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow">
              <TechnologyTable
                technologies={paginatedTechnologies}
                onEdit={handleEditTechnology}
                onDelete={async (technology) => {
                  try {
                    const response = await fetch(`/api/admin/technologies/${technology.id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });

                    if (response.ok) {
                      await fetchTechnologies();
                      showSuccess('Technology deleted', 'Technology has been deleted successfully.');
                    } else {
                      showError('Failed to delete technology');
                    }
                  } catch (error) {
                    showError('Failed to delete technology');
                  }
                }}
                onViewDetails={setShowTechnologyModal}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTechnologies.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : activeTab === 'projects' ? (
        <ProjectsPageClient />
      ) : null}

      <Modal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        title={editingTechnology ? "Edit Technology" : "Add New Technology"}
        maxWidth="max-w-4xl"
      >
        <TechnologyEditor
          technology={editingTechnology || undefined}
          onSave={handleSaveTechnology}
          onCancel={() => setShowEditor(false)}
        />
      </Modal>



      <TechnologyDetailsModal
        technology={showTechnologyModal}
        isOpen={!!showTechnologyModal}
        onClose={() => setShowTechnologyModal(null)}
      />
    </div>
  );
} 