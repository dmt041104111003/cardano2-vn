"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '~/components/toast-provider';
import { EventLocation } from '~/constants/admin';

interface EventLocationFormProps {
  eventLocations?: EventLocation[];
  onSuccess?: () => void;
}

export default function EventLocationForm({ eventLocations = [], onSuccess }: EventLocationFormProps) {
  const { showSuccess, showError } = useToastContext();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');

  const createMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
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
      onSuccess?.();
    },
    onError: (error: Error) => {
      showError(error.message);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showError('Event location name is required');
      return;
    }
    
    const isDuplicate = eventLocations?.some(
      (location: EventLocation) => location.name.toLowerCase() === newName.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      showError('Event location with this name already exists');
      return;
    }
    
    createMutation.mutate({ name: newName.trim() });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-4">
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
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-500 dark:border-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
        >
          {createMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
}
