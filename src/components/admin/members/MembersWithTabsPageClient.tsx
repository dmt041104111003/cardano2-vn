"use client";

import { AdminHeader } from "~/components/admin/common/AdminHeader";
import { AdminStats } from "~/components/admin/common/AdminStats";
import { AdminFilters } from "~/components/admin/common/AdminFilters";
import { MembersTable } from "~/components/admin/members/MembersTable";
import { MemberDetailsModal } from "~/components/admin/members/MemberDetailsModal";
import MemberEditor from "~/components/admin/members/MemberEditor";
import { TabsTable } from "~/components/admin/tabs/TabsTable";
import { TabDetailsModal } from "~/components/admin/tabs/TabDetailsModal";
import TabEditor from "~/components/admin/tabs/TabEditor";
import { Pagination } from "~/components/ui/pagination";
import AdminTableSkeleton from "~/components/admin/common/AdminTableSkeleton";
import Modal from "~/components/admin/common/Modal";
import { useMembersWithTabs } from "~/hooks/useMembersWithTabs";
import NotFoundInline from "~/components/ui/not-found-inline";
import AboutEditor from "~/components/admin/about/AboutEditor";
import { useToastContext } from "~/components/toast-provider";
import { Users, Layers } from "lucide-react";
import { useNotifications } from "~/hooks/useNotifications";

export default function MembersWithTabsPageClient() {
  const { showSuccess, showError } = useToastContext();
  
  useNotifications();
  
  const {
    searchTerm,
    publishStatusFilter,
    currentPage,
    showEditor,
    editingMember,
    viewingMember,
    showTabEditor,
    editingTab,
    viewingTab,
    activeTab,
    loadingMembers,
    loadingTabs,
    members,
    tabs,
    paginatedMembers,
    paginatedTabs,
    totalPages,
    ITEMS_PER_PAGE,
    setSearchTerm,
    setPublishStatusFilter,
    handleCreateMember,
    handleEditMember,
    handleViewMember,
    handleSaveMember,
    handleDeleteMember,
    handleCreateTab,
    handleEditTab,
    handleViewTab,
    handleSaveTab,
    handleDeleteTab,
    handlePageChange,
    handleTabChange,
    setShowEditor,
    setViewingMember,
    setShowTabEditor,
    setViewingTab,
  } = useMembersWithTabs();

  const stats = {
    totalMembers: members.length,
    totalTabs: tabs.length,
    draftMembers: members.filter(m => m.publishStatus === 'DRAFT').length,
    publishedMembers: members.filter(m => m.publishStatus === 'PUBLISHED').length,
  };

  const getActiveTabContent = () => {
    if (activeTab === 'members') {
      return (
        <>
          <AdminHeader 
            title="Members Management" 
            description="Manage team members for the about page"
            buttonText="Add Member"
            onAddClick={handleCreateMember}
          />

          <AdminStats 
            stats={[
              { label: "Total Members", value: stats.totalMembers },
              { label: "Draft", value: stats.draftMembers },
              { label: "Published", value: stats.publishedMembers },
            ]}
          />

          <AdminFilters
            searchTerm={searchTerm}
            filterType={publishStatusFilter}
            searchPlaceholder="Search members by name, role or description..."
            filterOptions={[
              { value: "all", label: "All Members" },
              { value: "DRAFT", label: "Draft" },
              { value: "PUBLISHED", label: "Published" },
            ]}
            onSearchChange={setSearchTerm}
            onFilterChange={(value) => setPublishStatusFilter(value as 'all' | 'DRAFT' | 'PUBLISHED')}
          />

          {loadingMembers ? (
            <AdminTableSkeleton columns={6} rows={5} />
          ) : paginatedMembers.length === 0 ? (
            <NotFoundInline 
              onClearFilters={() => {
                setSearchTerm('');
                setPublishStatusFilter('all');
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow">
              <MembersTable
                members={paginatedMembers}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
                onView={handleViewMember}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={members.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      );
    } else if (activeTab === 'tabs') {
      return (
        <>
          <AdminHeader 
            title="Tabs Management" 
            description="Manage tabs for organizing members"
            buttonText="Add Tab"
            onAddClick={handleCreateTab}
          />

          <AdminStats 
            stats={[
              { label: "Total Tabs", value: stats.totalTabs },
            ]}
          />

          <AdminFilters
            searchTerm={searchTerm}
            filterType="all"
            searchPlaceholder="Search tabs by name or description..."
            filterOptions={[
              { value: "all", label: "All Tabs" },
            ]}
            onSearchChange={setSearchTerm}
            onFilterChange={() => {}}
          />

          {loadingTabs ? (
            <AdminTableSkeleton columns={5} rows={5} />
          ) : paginatedTabs.length === 0 ? (
            <NotFoundInline 
              onClearFilters={() => {
                setSearchTerm('');
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow">
              <TabsTable
                tabs={paginatedTabs}
                onEdit={handleEditTab}
                onDelete={handleDeleteTab}
                onView={handleViewTab}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={tabs.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      );
    } else if (activeTab === 'about') {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">About Section Content</h2>
          <AboutEditor
            onSave={async (aboutData: any) => {
              try {
                const response = await fetch('/api/admin/about', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(aboutData),
                });

                if (response.ok) {
                  showSuccess('About content saved', 'About content has been saved successfully.');
                } else {
                  showError('Failed to save about content');
                }
              } catch (error) {
                showError('Failed to save about content');
              }
            }}
            onCancel={() => {}}
            isLoading={false}
          />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('members')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Members ({stats.totalMembers})</span>
          </button>
          <button
            onClick={() => handleTabChange('tabs')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'tabs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Tabs ({stats.totalTabs})</span>
          </button>
          <button
            onClick={() => handleTabChange('about')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>About Content</span>
          </button>
        </nav>
      </div>

      {getActiveTabContent()}

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

      <Modal
        isOpen={showTabEditor}
        onClose={() => setShowTabEditor(false)}
        title={editingTab ? "Edit Tab" : "Add New Tab"}
        maxWidth="max-w-2xl"
      >
        <TabEditor
          tab={editingTab || undefined}
          existingTabs={tabs}
          onSave={handleSaveTab}
          onCancel={() => setShowTabEditor(false)}
        />
      </Modal>

      <MemberDetailsModal
        member={viewingMember}
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
      />

      <TabDetailsModal
        tab={viewingTab}
        isOpen={!!viewingTab}
        onClose={() => setViewingTab(null)}
      />
    </div>
  );
} 