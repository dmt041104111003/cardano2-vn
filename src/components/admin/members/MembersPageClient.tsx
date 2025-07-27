"use client";

import { AdminHeader } from "~/components/admin/common/AdminHeader";
import { AdminStats } from "~/components/admin/common/AdminStats";
import { AdminFilters } from "~/components/admin/common/AdminFilters";
import { MembersTable } from "~/components/admin/members/MembersTable";
import { MemberDetailsModal } from "~/components/admin/members/MemberDetailsModal";
import MemberEditor from "~/components/admin/members/MemberEditor";
import { Pagination } from "~/components/ui/pagination";
import AdminTableSkeleton from "~/components/admin/common/AdminTableSkeleton";
import Modal from "~/components/admin/common/Modal";
import { useMembers } from "~/components/admin/members/useMembers";

export default function MembersPageClient() {
  const {
    searchTerm,
    currentPage,
    showEditor,
    editingMember,
    viewingMember,
    loadingMembers,
    members,
    paginatedMembers,
    totalPages,
    ITEMS_PER_PAGE,
    setSearchTerm,
    handleCreateMember,
    handleEditMember,
    handleViewMember,
    handleSaveMember,
    handleDeleteMember,
    handlePageChange,
    setShowEditor,
    setViewingMember,
  } = useMembers();

  const stats = {
    total: members.length,
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Members Management" 
        description="Manage team members for the about page"
        buttonText="Add Member"
        onAddClick={handleCreateMember}
      />

      <AdminStats 
        stats={[
          { label: "Total Members", value: stats.total },
        ]}
      />

      <AdminFilters
        searchTerm={searchTerm}
        filterType="all"
        searchPlaceholder="Search members by name, role or description..."
        filterOptions={[
          { value: "all", label: "All Members" },
        ]}
        onSearchChange={setSearchTerm}
        onFilterChange={() => {}}
      />

      {loadingMembers ? (
        <AdminTableSkeleton columns={4} rows={6} />
      ) : members.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-600">No members found.</p>
        </div>
      ) : (
        <>
          <MembersTable
            members={paginatedMembers}
            onView={handleViewMember}
            onEdit={handleEditMember}
            onDelete={handleDeleteMember}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={members.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        title={editingMember ? "Edit Member" : "Add New Member"}
        maxWidth="max-w-4xl"
      >
        <MemberEditor
          member={editingMember || undefined}
          onSave={handleSaveMember}
          onCancel={() => setShowEditor(false)}
        />
      </Modal>

      <MemberDetailsModal
        member={viewingMember}
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
      />
    </div>
  );
} 