"use client";

import { useState } from "react";
import { AdminHeader } from "~/components/admin/common/AdminHeader";
import { AdminStats } from "~/components/admin/common/AdminStats";
import { AdminFilters } from "~/components/admin/common/AdminFilters";
import TechnologyEditor from "~/components/admin/technologies/TechnologyEditor";
import DeleteConfirmModal from "~/components/admin/technologies/DeleteConfirmModal";
import { TechnologyTable } from "~/components/admin/technologies/TechnologyTable";
import TechnologyDetailsModal from "~/components/admin/technologies/TechnologyDetailsModal";
import Modal from "~/components/admin/common/Modal";
import { Pagination } from "~/components/ui/pagination";
import { useToastContext } from "~/components/toast-provider";
import { useQuery } from "@tanstack/react-query";
import AdminTableSkeleton from "~/components/admin/common/AdminTableSkeleton";

interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function TechnologiesPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<Technology | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTechnology, setDeletingTechnology] = useState<Technology | null>(null);
  const [showTechnologyModal, setShowTechnologyModal] = useState<Technology | null>(null);
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

  const handleCreateTechnology = () => {
    setEditingTechnology(null);
    setShowEditor(true);
  };

  const handleEditTechnology = (technology: Technology) => {
    setEditingTechnology(technology);
    setShowEditor(true);
  };

  const handleDeleteTechnology = (technology: Technology) => {
    setDeletingTechnology(technology);
    setShowDeleteModal(true);
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

  const handleDeleteConfirm = async () => {
    if (!deletingTechnology) return;
    try {
      const response = await fetch(`/api/admin/technologies/${deletingTechnology.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setShowDeleteModal(false);
        setDeletingTechnology(null);
        await fetchTechnologies();
        showSuccess('Technology deleted', 'Technology has been deleted successfully.');
      } else {
        showError('Failed to delete technology');
      }
    } catch (error) {
      showError('Failed to delete technology');
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
      <AdminHeader 
        title="Technologies Management" 
        description="Manage Cardano2vn technology projects"
        buttonText="Add Technology"
        onAddClick={handleCreateTechnology}
      />

      <AdminStats 
        stats={[
          { label: "Total Technologies", value: stats.total },
        ]}
      />

      <AdminFilters
        searchTerm={searchTerm}
        filterType="all"
        searchPlaceholder="Search technologies by title, name or description..."
        filterOptions={[
          { value: "all", label: "All Technologies" },
        ]}
        onSearchChange={setSearchTerm}
        onFilterChange={() => {}}
      />

      {loadingTechnologies ? (
        <AdminTableSkeleton columns={5} rows={6} />
      ) : filteredTechnologies.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No technologies found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <TechnologyTable
            technologies={paginatedTechnologies}
            onEdit={handleEditTechnology}
            onDelete={handleDeleteTechnology}
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

      {showDeleteModal && deletingTechnology && (
        <DeleteConfirmModal
          title="Delete Technology"
          message={`Are you sure you want to delete "${deletingTechnology.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingTechnology(null);
          }}
        />
      )}

      <TechnologyDetailsModal
        technology={showTechnologyModal}
        isOpen={!!showTechnologyModal}
        onClose={() => setShowTechnologyModal(null)}
      />
    </div>
  );
} 