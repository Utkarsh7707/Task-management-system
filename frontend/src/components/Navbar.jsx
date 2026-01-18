import { useContext, useEffect, useState } from 'react'; // Added useEffect, useState
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios'; // Import API to check for notifications
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Layout, Bell, CheckCircle } from 'lucide-react'; // Added Bell icon

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // To trigger re-checks on page change
  const [notifyCount, setNotifyCount] = useState(0);

  // Logic: Check for tasks assigned to me that are still 'Todo'
  useEffect(() => {
    if (user) {
      const checkNotifications = async () => {
        try {
          const { data } = await API.get('/tasks/my-tasks');
          // Count tasks that are assigned to me and status is 'Todo' (New)
          const newTasks = data.filter(t => t.status === 'Todo').length;
          setNotifyCount(newTasks);
        } catch (error) {
          console.error("Notify check failed", error);
        }
      };
      checkNotifications();
    }
  }, [user, location.pathname]); // Re-run when user logs in or changes pages

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Increased height to h-20 for a more spacious, premium feel
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 h-20 flex items-center">
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center">
          
          {/* LEFT SIDE: LOGO (Made text bigger) */}
          <Link to="/" className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition">
            <Layout className="w-8 h-8" /> {/* Bigger Icon */}
            <span className="font-bold text-2xl tracking-tight">TaskFlow</span> {/* Bigger Text */}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-8"> {/* Increased gap between items */}
              
              {/* NOTIFICATION SECTION */}
              <Link to="/my-tasks" className="relative group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors">
                <div className="relative p-2">
                    <Bell className="w-6 h-6" />
                    {/* The Red Badge */}
                    {notifyCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                            {notifyCount}
                        </span>
                    )}
                </div>
                <span className="text-base font-medium hidden md:block">My Tasks</span>
              </Link>

              {/* USER PROFILE SECTION */}
              <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-base font-bold text-slate-800 leading-none mb-1">{user.name}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded-full">
                    {user.role}
                  </span>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-6">
              <Link to="/login" className="text-base font-medium text-slate-600 hover:text-indigo-600 py-2">Login</Link>
              <Link to="/register" className="text-base font-medium bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;