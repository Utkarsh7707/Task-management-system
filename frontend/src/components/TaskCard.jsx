import { Calendar, User } from 'lucide-react';

const PriorityBadge = ({ p }) => {
  const colors = {
    Low: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    High: 'bg-red-100 text-red-700 border-red-200'
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${colors[p]}`}>{p}</span>;
};

const TaskCard = ({ task, currentUserId, users, onDragStart }) => {
  const isMyTask = task.assignedTo === currentUserId;

  const getUserName = (userId) => {
    if (!userId) return 'Unassigned';
    const u = users.find(u => u._id === userId);
    return u ? u.name : 'Unknown';
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className={`relative bg-white p-5 rounded-lg shadow-sm border transition-all cursor-move
        hover:shadow-lg hover:-translate-y-1 active:cursor-grabbing
        ${isMyTask ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'}
      `}
    >
      {isMyTask && (
         <span className="absolute -top-2.5 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 border border-white">
            ME
         </span>
      )}

      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-800 text-base leading-snug">{task.title}</h4>
        <PriorityBadge p={task.priority} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <User className="w-4 h-4 text-slate-400" /> 
          <span className={isMyTask ? "font-medium text-indigo-700" : ""}>
             {getUserName(task.assignedTo)}
          </span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" /> 
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;