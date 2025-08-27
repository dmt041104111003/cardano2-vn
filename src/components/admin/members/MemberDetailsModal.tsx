import Modal from "~/components/admin/common/Modal";
import { SimpleRichPreview } from "~/components/ui/simple-rich-editor";
import { Member, MemberDetailsModalProps } from "~/constants/members";

export function MemberDetailsModal({ member, isOpen, onClose }: MemberDetailsModalProps) {
  if (!member) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Member Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <img 
            src={member.image} 
            alt={member.name}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-sm text-gray-900">{member.email || 'Not provided'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <p className="text-sm text-gray-900">{member.order}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
            <p className="text-sm text-gray-900">{member.color || 'blue'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {member.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="text-sm text-gray-900 leading-relaxed">
            <SimpleRichPreview content={member.description} />
          </div>
        </div>
        
        {member.skills && member.skills.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <p className="text-sm text-gray-900">
              {member.createdAt ? 
                new Date(member.createdAt).toLocaleString('en-GB', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', hour12: false
                }) : '-'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
            <p className="text-sm text-gray-900">
              {member.updatedAt ? 
                new Date(member.updatedAt).toLocaleString('en-GB', {
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