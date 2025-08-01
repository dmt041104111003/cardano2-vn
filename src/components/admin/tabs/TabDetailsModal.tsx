"use client";

import Modal from "~/components/admin/common/Modal";
import { Tab, Member } from "~/constants/members";
import { TabDetailsModalProps } from "~/constants/tabs";

export function TabDetailsModal({ tab, isOpen, onClose }: TabDetailsModalProps) {
  if (!tab) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tab Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{tab.name}</h3>
            <p className="text-sm text-gray-600">Tab</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <p className="text-sm text-gray-900">{tab.order}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              tab.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {tab.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Members Count</label>
          <p className="text-sm text-gray-900">{tab.members?.length || 0} members</p>
        </div>
        
        {tab.members && tab.members.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
            <div className="space-y-2">
              {tab.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-sm text-gray-500 truncate">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <p className="text-sm text-gray-900">
              {tab.createdAt ? 
                new Date(tab.createdAt).toLocaleString('en-GB', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: false
                }) : '-'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
            <p className="text-sm text-gray-900">
              {tab.updatedAt ? 
                new Date(tab.updatedAt).toLocaleString('en-GB', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: false
                }) : '-'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
} 