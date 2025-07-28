import { Edit, Trash2, Shield, User as UserIcon, Copy as CopyIcon } from 'lucide-react';
import { User } from '~/constants/users';
import { WalletAvatar } from '~/components/WalletAvatar';
import Image from 'next/image';
import { useToastContext } from "../../toast-provider";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string, role: 'USER' | 'ADMIN') => void;
  currentUserAddress?: string | null;
}

function shortenAddress(address: string, chars = 6) {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return address.slice(0, chars) + '...' + address.slice(-chars);
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onRoleChange,
  currentUserAddress,
}: UserTableProps) {
  const { showSuccess } = useToastContext();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] md:min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              First Login
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <WalletAvatar address={user.address} size={40} />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {user.provider === 'google' ? (
                    <>
                      <span className="text-sm text-gray-900" title={user.email}>{user.email}</span>
                      <button
                        onClick={() => {navigator.clipboard.writeText(user.email || ''); showSuccess('Copied!');}}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy email"
                      >
                        <CopyIcon className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-gray-900 font-mono" title={user.address}>{shortenAddress(user.address, 6)}</span>
                      <button
                        onClick={() => {navigator.clipboard.writeText(user.address); showSuccess('Copied!');}}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy address"
                      >
                        <CopyIcon className="h-4 w-4 text-gray-400 hover:text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {user.role === 'ADMIN' ? (
                    <Shield className="h-4 w-4 text-blue-600 mr-2" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  )}
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value as 'USER' | 'ADMIN')}
                    className="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none"
                    title={`Change role for ${user.name}`}
                    disabled={Boolean(user.role === 'ADMIN' || (currentUserAddress && user.address === currentUserAddress))}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.createdAt ? (
                  <div>{formatDateTime(user.createdAt)}</div>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.lastLogin ? (
                  <div>{formatDateTime(user.lastLogin)}</div>
                ) : (
                  <span className="text-gray-400">Never</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-900"
                    title={`Edit ${user.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                    title={`Delete ${user.name}`}
                    disabled={user.role === 'ADMIN' || !!(currentUserAddress && user.address === currentUserAddress)}
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
  );
} 