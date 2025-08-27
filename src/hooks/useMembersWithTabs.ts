import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToastContext } from "~/components/toast-provider";
import { Tab, Member } from "~/constants/members";

export function useMembersWithTabs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [publishStatusFilter, setPublishStatusFilter] = useState<'all' | 'DRAFT' | 'PUBLISHED'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  
  const [showTabEditor, setShowTabEditor] = useState(false);
  const [editingTab, setEditingTab] = useState<Tab | null>(null);
  const [viewingTab, setViewingTab] = useState<Tab | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'tabs' | 'about'>('members');
  
  const { showSuccess, showError } = useToastContext();

  const {
    data: membersData,
    isLoading: loadingMembers,
    refetch: fetchMembers,
  } = useQuery({
    queryKey: ['admin-members'],
    queryFn: async () => {
      const res = await fetch('/api/admin/members', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    }
  });

  const {
    data: tabsData,
    isLoading: loadingTabs,
    refetch: fetchTabs,
  } = useQuery({
    queryKey: ['admin-tabs'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tabs', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch tabs');
      return res.json();
    }
  });

  const members: Member[] = membersData?.data || [];
  const tabs: Tab[] = tabsData?.data || [];

  const handleCreateMember = () => {
    setEditingMember(null);
    setShowEditor(true);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowEditor(true);
  };

  const handleViewMember = (member: Member) => {
    setViewingMember(member);
  };

  const handleSaveMember = async (memberData: any) => {
    try {
      console.log('Saving member data:', memberData);
      
      const url = editingMember ? `/api/admin/members/${editingMember.id}` : '/api/admin/members';
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Save successful:', result);
        
        setShowEditor(false);
        await fetchMembers();
        showSuccess(
          editingMember ? 'Member updated' : 'Member created',
          editingMember ? 'Member has been updated successfully.' : 'Member has been created successfully.'
        );
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        showError(`Failed to save member: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      showError(`Failed to save member: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        await fetchMembers();
        showSuccess('Member deleted', 'Member has been deleted successfully.');
      } else {
        showError('Failed to delete member');
      }
    } catch (error) {
      showError('Failed to delete member');
    }
  };

  const handleCreateTab = () => {
    setEditingTab(null);
    setShowTabEditor(true);
  };

  const handleEditTab = (tab: Tab) => {
    setEditingTab(tab);
    setShowTabEditor(true);
  };

  const handleViewTab = (tab: Tab) => {
    setViewingTab(tab);
  };

  const handleSaveTab = async (tabData: { name: string; description?: string; color?: string; order: number }) => {
    try {
      const url = editingTab ? `/api/admin/tabs/${editingTab.id}` : '/api/admin/tabs';
      const method = editingTab ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tabData),
      });

      if (response.ok) {
        setShowTabEditor(false);
        await fetchTabs();
        showSuccess(
          editingTab ? 'Tab updated' : 'Tab created',
          editingTab ? 'Tab has been updated successfully.' : 'Tab has been created successfully.'
        );
      } else {
        showError('Failed to save tab');
      }
    } catch (error) {
      showError('Failed to save tab');
    }
  };

  const handleDeleteTab = async (tabId: string) => {
    try {
      const response = await fetch(`/api/admin/tabs/${tabId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        await fetchTabs();
        showSuccess('Tab deleted', 'Tab has been deleted successfully.');
      } else {
        showError('Failed to delete tab');
      }
    } catch (error) {
      showError('Failed to delete tab');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPublishStatus = publishStatusFilter === 'all' || member.publishStatus === publishStatusFilter;
    
    return matchesSearch && matchesPublishStatus;
  });

  const filteredTabs = tabs.filter(tab => {
    const matchesSearch = tab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (tab.description && tab.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil((activeTab === 'members' ? filteredMembers.length : filteredTabs.length) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const paginatedTabs = filteredTabs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: 'members' | 'tabs' | 'about') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm('');
    setPublishStatusFilter('all');
  };

  return {
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
    setShowEditor,
    setViewingMember,
    setShowTabEditor,
    setViewingTab,
    
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
  };
}
