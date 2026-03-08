import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { projectsAPI, tasksAPI } from '../services/api';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import TaskModal from '../components/TaskModal';
const columns = [
  { id: 'To Do', title: 'To Do', color: 'bg-gray-200' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-200' },
  { id: 'Done', title: 'Done', color: 'bg-green-200' }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (project) fetchTasks();
  }, [project, search, priorityFilter]);

  const fetchProject = async () => {
    try {
      const res = await projectsAPI.getOne(id);
      setProject(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch project');
    }
    setLoading(false);
  };

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getAll(id, { search, priority: priorityFilter });
      setTasks(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await tasksAPI.delete(taskId);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleDragEnd = async (result) => {
   
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t =>
      t._id === draggableId ? { ...t, status: newStatus } : t
    ));
    try {
      await tasksAPI.update(draggableId, { status: newStatus });
    } catch (error) {
      toast.error('Failed to update task');
      fetchTasks();  // Revert to server state on error
    }
  };
  const handleSave = () => {
    setShowModal(false);
    setEditingTask(null);
    fetchTasks();
  };
  const getPriorityColor = (priority) => {
    const colors = {
      Low: 'bg-gray-100 text-gray-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      High: 'bg-red-100 text-red-700'
    };
    return colors[priority] || colors.Medium;
  };
  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* HEADER: Back button, Project info, Add Task button */}
      <div className="flex items-center gap-4 mb-6">
        {/* Back to Dashboard */}
        <Link to="/dashboard" className="p-2 hover:bg-gray-200 rounded-lg">
          <FiArrowLeft className="h-5 w-5" />
        </Link>

        {/* Project Name and Description */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
          <p className="text-gray-600">{project?.description}</p>
        </div>

        {/* Add Task Button */}
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Task
        </button>
      </div>

      {/* FILTERS: Search and Priority */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Render each column */}
          {columns.map((col) => (
            <div key={col.id} className="bg-gray-50 rounded-xl p-4">

              {/* Column Header with count */}
              <div className={`${col.color} rounded-lg px-4 py-2 mb-4`}>
                <h3 className="font-semibold text-gray-800">
                  {col.title} ({getTasksByStatus(col.id).length})
                </h3>
              </div>

              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[200px]"
                  >
                    {getTasksByStatus(col.id).map((task, index) => (

                     
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded-lg p-4 shadow-sm ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          >
                            {/* Task Header: Title and Priority Badge */}
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Description (if exists) */}
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                            )}

                            {/* Due Date (if exists) */}
                            {task.dueDate && (
                              <p className="text-xs text-gray-500 mb-2">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </p>
                            )}

                            {/* Action Buttons: Edit and Delete */}
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => { setEditingTask(task); setShowModal(true); }}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiEdit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(task._id)}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {/*
                      provided.placeholder: Required!
                      Creates space for dragged item while it's being moved
                    */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* TASK MODAL: Create/Edit tasks */}
      {showModal && (
        <TaskModal
          projectId={id}
          task={editingTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ProjectDetail;

