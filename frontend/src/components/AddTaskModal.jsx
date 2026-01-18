import { useState } from 'react';
import { X } from 'lucide-react';
import UserSelect from './UserSelect'; // Using our new reusable component

const AddTaskModal = ({ isOpen, onClose, onAdd, users }) => {
  const [newTask, setNewTask] = useState({ 
    title: '', 
    priority: 'Medium', 
    assignedTo: '', 
    dueDate: '' 
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newTask);
    setNewTask({ title: '', priority: 'Medium', assignedTo: '', dueDate: '' }); // Reset
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl overflow-visible"> 
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-800">New Task</h2>
           <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-6 h-6"/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Task Title</label>
            <input 
               className="input-field py-2.5 text-base" 
               placeholder="e.g. Redesign Homepage"
               value={newTask.title} 
               onChange={e => setNewTask({...newTask, title: e.target.value})} 
               required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <UserSelect 
              users={users} 
              selectedUserId={newTask.assignedTo}
              onSelect={(id) => setNewTask({...newTask, assignedTo: id})} 
            />

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1">Priority</label>
              <select className="input-field py-2.5" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Due Date</label>
            <input type="date" className="input-field py-2.5" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary px-6 py-2.5">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2.5 shadow-md hover:shadow-lg transform active:scale-95 transition-all">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;