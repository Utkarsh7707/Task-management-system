import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const UserSelect = ({ users, selectedUserId, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Auto-fill query if a user is already selected (for editing scenarios)
  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u._id === selectedUserId);
      if (user) setQuery(user.name);
    } else {
      setQuery('');
    }
  }, [selectedUserId, users]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter(u => 
    !query || 
    u.name.toLowerCase().includes(query.toLowerCase()) || 
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (user) => {
    setQuery(user.name);
    onSelect(user._id);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    onSelect('');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="text-sm font-semibold text-slate-700 block mb-1">Assign To</label>
      <div className="relative">
        <input 
          type="text" 
          className="input-field pr-10 py-2.5" 
          placeholder="Search users..." 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') onSelect('');
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query ? (
            <X className="absolute right-3 top-3 w-4 h-4 text-slate-400 cursor-pointer hover:text-red-500" onClick={handleClear} />
        ) : (
            <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-[999] w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
            {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                    <div 
                        key={u._id}
                        className="px-4 py-3 text-sm hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0"
                        onClick={() => handleSelect(u)}
                    >
                        <div className="font-semibold text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                    </div>
                ))
            ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">No users found</div>
            )}
        </div>
      )}
    </div>
  );
};

export default UserSelect;