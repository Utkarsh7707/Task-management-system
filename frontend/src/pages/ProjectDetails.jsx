import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Import our new sub-components
import KanbanColumn from '../components/KanbanColumn';
import AddTaskModal from '../components/AddTaskModal';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [tasks, setTasks] = useState([]);
  const [usersList, setUsersList] = useState([]); 
  const [stats, setStats] = useState({ total: 0, done: 0 }); // Simplified init
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const loadData = async () => {
    try {
      const [taskRes, statRes, userRes] = await Promise.all([
        API.get(`/tasks/${id}`),
        API.get(`/projects/${id}/stats`),
        API.get('/auth/users') 
      ]);
      setTasks(taskRes.data);
      setStats(statRes.data);
      setUsersList(userRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading data:", err);
      setLoading(false); 
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleAddTask = async (newTaskData) => {
    try {
      const payload = { 
        ...newTaskData, 
        project: id,
        assignedTo: newTaskData.assignedTo === "" ? undefined : newTaskData.assignedTo,
        dueDate: newTaskData.dueDate === "" ? undefined : newTaskData.dueDate
      };

      await API.post('/tasks', payload);
      setIsModalOpen(false);
      loadData(); 
    } catch (err) {
      alert("Failed to add task: " + (err.response?.data?.message || err.message));
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      const statRes = await API.get(`/projects/${id}/stats`);
      setStats(statRes.data);
    } catch (err) {
      alert("Update failed");
      loadData();
    }
  };

  // Drag Handlers
  const onDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-slate-500">Loading Board...</div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Tasks</span>
            <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
          </div>
          <div className="flex flex-col border-l pl-8">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Completed</span>
            <span className="text-2xl font-bold text-green-600">{stats.done}</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary flex items-center gap-2 text-base px-5 py-2.5 shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="flex h-full gap-8 min-w-[1000px]">
          {['Todo', 'In Progress', 'Done'].map(status => (
            <KanbanColumn 
              key={status}
              status={status}
              tasks={tasks.filter(t => t.status === status)}
              currentUserId={user._id}
              users={usersList}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask}
        users={usersList}
      />
    </div>
  );
};

export default ProjectDetails;