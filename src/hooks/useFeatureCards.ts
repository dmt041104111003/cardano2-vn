import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToastContext } from "~/components/toast-provider";
import { FeatureCard } from "~/constants/feature-cards";

export function useFeatureCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [publishStatusFilter, setPublishStatusFilter] = useState<'all' | 'DRAFT' | 'PUBLISHED'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [editingFeatureCard, setEditingFeatureCard] = useState<FeatureCard | null>(null);
  const [viewingFeatureCard, setViewingFeatureCard] = useState<FeatureCard | null>(null);
  
  const { showSuccess, showError } = useToastContext();

  const {
    data: featureCardsData,
    isLoading: loadingFeatureCards,
    refetch: fetchFeatureCards,
  } = useQuery({
    queryKey: ['admin-feature-cards'],
    queryFn: async () => {
      const res = await fetch('/api/admin/feature-cards', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch feature cards');
      return res.json();
    }
  });

  const featureCards: FeatureCard[] = featureCardsData?.data || [];

  const handleCreateFeatureCard = () => {
    setEditingFeatureCard(null);
    setShowEditor(true);
  };

  const handleEditFeatureCard = (featureCard: FeatureCard) => {
    setEditingFeatureCard(featureCard);
    setShowEditor(true);
  };

  const handleViewFeatureCard = (featureCard: FeatureCard) => {
    setViewingFeatureCard(featureCard);
  };

  const handleSaveFeatureCard = async (featureCardData: any) => {
    try {
      console.log('Saving feature card data:', featureCardData);
      
      const url = editingFeatureCard ? `/api/admin/feature-cards/${editingFeatureCard.id}` : '/api/admin/feature-cards';
      const method = editingFeatureCard ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(featureCardData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Save successful:', result);
        
        setShowEditor(false);
        
        // Use setTimeout to delay the refetch and prevent immediate auto-update
        setTimeout(async () => {
          await fetchFeatureCards();
        }, 100);
        
        showSuccess(
          editingFeatureCard ? 'Feature card updated' : 'Feature card created',
          editingFeatureCard ? 'Feature card has been updated successfully.' : 'Feature card has been created successfully.'
        );
      } else {
        const errorData = await response.json();
        console.error('Save failed:', errorData);
        showError(`Failed to save feature card: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      showError(`Failed to save feature card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteFeatureCard = async (featureCard: FeatureCard) => {
    try {
      console.log('Deleting feature card:', featureCard.id);
      const response = await fetch(`/api/admin/feature-cards/${featureCard.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      console.log('Delete response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Delete successful:', result);
        
        // Use setTimeout to delay the refetch and prevent immediate auto-update
        setTimeout(async () => {
          await fetchFeatureCards();
        }, 100);
        
        showSuccess('Feature card deleted', 'Feature card has been deleted successfully.');
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        showError(`Failed to delete feature card: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      showError(`Failed to delete feature card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const filteredFeatureCards = featureCards.filter(featureCard => {
    const matchesSearch = featureCard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         featureCard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         featureCard.iconName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPublishStatus = publishStatusFilter === 'all' || featureCard.publishStatus === publishStatusFilter;
    
    return matchesSearch && matchesPublishStatus;
  });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredFeatureCards.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFeatureCards = filteredFeatureCards.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    searchTerm,
    publishStatusFilter,
    currentPage,
    showEditor,
    editingFeatureCard,
    viewingFeatureCard,
    loadingFeatureCards,
    featureCards,
    paginatedFeatureCards,
    totalPages,
    ITEMS_PER_PAGE,
    
    setSearchTerm,
    setPublishStatusFilter,
    setShowEditor,
    setViewingFeatureCard,
    
    handleCreateFeatureCard,
    handleEditFeatureCard,
    handleViewFeatureCard,
    handleSaveFeatureCard,
    handleDeleteFeatureCard,
    handlePageChange,
  };
}
