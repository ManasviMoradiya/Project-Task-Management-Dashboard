import { useState } from 'react';
import { toast } from 'react-toastify';
import { projectsAPI } from '../services/api';
import { FiX } from 'react-icons/fi';
const ProjectModal = ({ project, onClose, onSave }) => {

  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'Active'
  });

  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
   
    e.preventDefault();

    setLoading(true);

    try {
      
      if (project) {
        // Update existing project
        await projectsAPI.update(project._id, formData);
        toast.success('Project updated');
      } else {
        // Create new project
        await projectsAPI.create(formData);
        toast.success('Project created');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      {/* MODAL CARD */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">

        {/* HEADER: Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {/* Dynamic title based on mode */}
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          {/* Close button - calls onClose to hide modal */}
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input (Required) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter project name"
            />
          </div>

          {/* Description Textarea (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Enter project description"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="input-field">
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-2">
            {/* Cancel button - type="button" prevents form submission */}
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            {/* Save button - disabled while loading to prevent double-submit */}
            <button type="submit" disabled={loading} className="flex-1 btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

