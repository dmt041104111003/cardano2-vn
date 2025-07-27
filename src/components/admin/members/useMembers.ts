import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToastContext } from "~/components/toast-provider";

interface Member {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  color?: string;
  skills?: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const { showSuccess, showError } = useToastContext();

  const {
    data: queryData,
    isLoading: loadingMembers,
    refetch: fetchMembers,
  } = useQuery({
    queryKey: ['admin-members'],
    queryFn: async () => {
      const res = await fetch('/api/admin/members');
      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    }
  });

  const members: Member[] = queryData?.members || [];

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

  const handleSaveMember = async (memberData: { name: string; role: string; description: string; image: string; email?: string; color?: string; skills?: string[]; order: number }) => {
    try {
      const url = editingMember ? `/api/admin/members/${editingMember.id}` : '/api/admin/members';
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        setShowEditor(false);
        await fetchMembers();
        showSuccess(
          editingMember ? 'Member updated' : 'Member created',
          editingMember ? 'Member has been updated successfully.' : 'Member has been created successfully.'
        );
      } else {
        showError('Failed to save member');
      }
    } catch (error) {
      showError('Failed to save member');
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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // State
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
    
    // Handlers
    setSearchTerm,
    handleCreateMember,
    handleEditMember,
    handleViewMember,
    handleSaveMember,
    handleDeleteMember,
    handlePageChange,
    setShowEditor,
    setViewingMember,
  };
} 