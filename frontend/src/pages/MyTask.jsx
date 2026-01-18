import { useEffect, useState } from 'react';
import API from '../api/axios';
import { CheckCircle, Clock, Layout, AlertCircle } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTasks = async () => {
    try {
      const { data } = await API.get('/tasks/my-tasks');
      setTasks(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyTasks(); }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistic update (update UI immediately)
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update status");
      fetchMyTasks(); // Revert on error
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'Todo': return 'bg-slate-100 text-slate-600';
        case 'In Progress': return 'bg-blue-100 text-blue-700';
        case 'Done': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100';
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your tasks...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-indigo-600" /> My Assigned Tasks
      </h1>

      {tasks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <Layout className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">You have no tasks assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
                
                {/* Task Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border 
                            ${task.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' : 
                              task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                              'bg-green-50 text-green-700 border-green-100'}`}>
                            {task.priority}
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800">{task.title}</h3>
                    
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                        {/* Show Project Name */}
                        <Layout className="w-4 h-4" /> 
                        <span className="font-medium text-slate-700">
                            {task.project ? task.project.title : 'Deleted Project'}
                        </span>
                        
                        {task.dueDate && (
                            <>
                                <span className="mx-1">•</span>
                                <Clock className="w-4 h-4" />
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Action: Change Status */}
                <div className="shrink-0 w-full md:w-auto">
                    <select 
                        className="w-full md:w-40 p-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;