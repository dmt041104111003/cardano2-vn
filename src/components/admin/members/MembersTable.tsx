"use client";

import { Edit, Trash2, Eye } from "lucide-react";

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

interface MembersTableProps {
  members: Member[];
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

export function MembersTable({ members, onView, onEdit, onDelete }: MembersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.createdAt ? 
                    new Date(member.createdAt).toLocaleString('en-GB', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: false
                    }) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.updatedAt ? 
                    new Date(member.updatedAt).toLocaleString('en-GB', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: false
                    }) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(member)}
                      className="text-green-600 hover:text-green-900"
                      title={`View ${member.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(member)}
                      className="text-blue-600 hover:text-blue-900"
                      title={`Edit ${member.name}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="text-red-600 hover:text-red-900"
                      title={`Delete ${member.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 