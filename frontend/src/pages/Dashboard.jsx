import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectsAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFolder, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProjectModal from '../components/ProjectModal';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [search, statusFilter, currentPage]);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll({
        search,
        status: statusFilter,
        page: currentPage,
        limit: 6  // Show 6 projects per page
      });

      setProjects(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch projects');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsAPI.delete(id);
        toast.success('Project deleted');
        fetchProjects();  // Refresh list
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingProject(null);
    fetchProjects();
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* HEADER: Title and New Project Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">Manage your projects and tasks</p>
        </div>
        {/* New Project button - opens modal in create mode */}
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus /> New Project
        </button>
      </div>

      {/* FILTERS: Search and Status */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);  // Reset to page 1 when searching
            }}
            className="input-field"
          />
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);  // Reset to page 1 when filtering
          }}
          className="input-field w-full sm:w-48"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* CONTENT: Loading / Empty / Project Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <FiFolder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
          <p className="text-gray-500 mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <>
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              /* PROJECT CARD */
              <div key={project._id} className="card hover:shadow-lg transition-shadow">
                {/* Card Header: Name and Status */}
                <div className="flex justify-between items-start mb-3">
                  {/* Project name links to Kanban board */}
                  <Link to={`/projects/${project._id}`} className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                    {project.name}
                  </Link>
                  {/* Status badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Description with line clamp (max 2 lines) */}
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description || 'No description'}</p>

                {/* Card Footer: Date and Actions */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  {/* Created date */}
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>

                  {/* Edit and Delete buttons */}
                  <div className="flex gap-2">
                    {/* Edit button - opens modal in edit mode */}
                    <button
                      onClick={() => { setEditingProject(project); setShowModal(true); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION: Only show if more than 1 page */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {/* Previous button */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <FiChevronLeft />
              </button>

              {/* Page indicator */}
              <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>

              {/* Next button */}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* PROJECT MODAL: Rendered conditionally when showModal is true */}
      {showModal && (
        <ProjectModal
          project={editingProject}  // null for create, project object for edit
          onClose={() => { setShowModal(false); setEditingProject(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Dashboard;

