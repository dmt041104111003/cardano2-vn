"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/components/toast-provider';
import { EventLocationTable } from './EventLocationTable';
import { Pagination } from '~/components/ui/pagination';
import { EventLocation } from '~/constants/admin';

import EventLocationEditModal from './EventLocationEditModal';

export default function EventLocationManager() {
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [editingLocation, setEditingLocation] = useState<EventLocation | null>(null);

  const { data: eventLocations, isLoading } = useQuery({
    queryKey: ['admin-event-locations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/event-locations');
      if (!response.ok) {
        throw new Error('Failed to fetch event locations');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, 
    gcTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });



  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/admin/event-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create event location');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-locations'] });
      queryClient.invalidateQueries({ queryKey: ['contact-form-event-locations'] });
      setNewName('');
      showSuccess('Event location created successfully');
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const response = await fetch(`/api/admin/event-locations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update event location');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-locations'] });
      queryClient.invalidateQueries({ queryKey: ['contact-form-event-locations'] });
      setEditingLocation(null);
      showSuccess('Event location updated successfully');
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/event-locations/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete event location');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-locations'] });
      queryClient.invalidateQueries({ queryKey: ['contact-form-event-locations'] });
      showSuccess('Event location deleted successfully');
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showError('Name is required');
      return;
    }
    
    const isDuplicate = eventLocations?.some(
      (location: EventLocation) => location.name.toLowerCase() === newName.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      showError('Event location with this name already exists');
      return;
    }
    
    createMutation.mutate(newName.trim());
  };

  const handleUpdate = (id: string, name: string) => {
    if (!name.trim()) {
      showError('Name is required');
      return;
    }
    
    // Check for duplicate names (excluding current item)
    const isDuplicate = eventLocations?.some(
      (location: EventLocation) => 
        location.id !== id && 
        location.name.toLowerCase() === name.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      showError('Event location with this name already exists');
      return;
    }
    
    updateMutation.mutate({ id, name: name.trim() });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const startEditing = (location: EventLocation) => {
    setEditingLocation(location);
  };



  // Filter and paginate data
  const filteredEventLocations = useMemo(() => {
    return eventLocations?.filter((location: EventLocation) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [eventLocations, searchTerm]);

  const totalPages = Math.ceil(filteredEventLocations.length / ITEMS_PER_PAGE);
  const paginatedEventLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEventLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEventLocations, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
             {/* Add New Section */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleCreate} className="flex gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter event location name"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors font-medium"
          >
            {createMutation.isPending ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

             {/* Search and Table Section */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search event locations..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden">
                     <EventLocationTable
             eventLocations={paginatedEventLocations}
             onEdit={startEditing}
             onDelete={handleDelete}
             
           />
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEventLocations.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
                 </div>
       </div>

       

       {/* Edit Modal */}
       <EventLocationEditModal
         eventLocation={editingLocation}
         isOpen={!!editingLocation}
         onClose={() => setEditingLocation(null)}
         onSave={handleUpdate}
         isSaving={updateMutation.isPending}
       />
     </div>
   );
} 