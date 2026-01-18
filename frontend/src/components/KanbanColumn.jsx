import TaskCard from './TaskCard';

const KanbanColumn = ({ status, tasks, currentUserId, users, onDragStart, onDragOver, onDrop }) => {
  // Styling based on status
  const bgColors = {
    'Todo': 'bg-slate-50',
    'In Progress': 'bg-blue-50',
    'Done': 'bg-green-50'
  };
  const textColors = {
    'Todo': 'text-slate-700',
    'In Progress': 'text-blue-700',
    'Done': 'text-green-700'
  };

  return (
    <div 
      className="flex-1 flex flex-col bg-slate-100 rounded-xl border border-slate-200 shadow-inner min-w-[300px]"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {/* Column Header */}
      <div className={`p-4 border-b border-slate-200 rounded-t-xl flex justify-between items-center ${bgColors[status]}`}>
        <h3 className={`font-bold text-base uppercase tracking-wide ${textColors[status]}`}>
          {status}
        </h3>
        <span className="bg-white px-2.5 py-1 rounded-md text-sm font-bold border border-slate-200 shadow-sm">
          {tasks.length}
        </span>
      </div>
      
      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            currentUserId={currentUserId} 
            users={users}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;