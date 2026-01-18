import { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Folder, Clock, Trash2, Layout } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects");
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', form);
      setForm({ title: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert("Error creating project");
    }
  };

  const handleDelete = async (e, projectId) => {
    e.preventDefault();
    if(window.confirm("Are you sure you want to delete this project?")) {
        try {
            await API.delete(`/projects/${projectId}`);
            fetchProjects();
        } catch (err) {
            alert("Failed to delete project");
        }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {user?.role === 'admin' ? 'System Projects' : 'My Projects'}
          </h1>
          <p className="text-lg text-slate-500 mt-2">
            {user?.role === 'admin' 
              ? 'Overview of all active projects in the workspace.' 
              : 'Manage your ongoing work and track progress.'}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="btn-primary flex items-center gap-2 px-6 py-3 text-base shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="p-4 bg-slate-50 rounded-full mb-4">
            <Folder className="w-16 h-16 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No projects yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm text-center text-lg">
            Create your first project to start organizing tasks and collaborating with your team.
          </p>
          <button onClick={() => setShowModal(true)} className="mt-6 text-indigo-600 font-semibold hover:underline text-lg">
            Create Project &rarr;
          </button>
        </div>
      ) : (
        /* PROJECTS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <Link 
              key={p._id} 
              to={`/project/${p._id}`} 
              className="card group p-8 relative block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              
              <div className="flex items-start justify-between mb-6">
                {/* Minimalist 'Logo' Icon */}
                <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Layout className="w-7 h-7" />
                </div>
                
                {/* Delete Button */}
                <button 
                    onClick={(e) => handleDelete(e, p._id)}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Project"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Badge */}
              {user?.role === 'admin' && p.owner && (
                 <div className="mb-3">
                   <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                      Owner: {p.owner.name || 'Unknown'}
                   </span>
                 </div>
              )}

              <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {p.title}
              </h3>
              
              <p className="text-base text-slate-500 mb-6 line-clamp-2 leading-relaxed h-12">
                {p.description || "No description provided for this project."}
              </p>
              
              <div className="flex items-center text-sm font-medium text-slate-400 gap-2 border-t border-slate-100 pt-5">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl transform transition-all scale-100">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">New Project</h2>
            <p className="text-slate-500 mb-8 text-lg">Set up a workspace for your new tasks.</p>
            
            <form onSubmit={createProject} className="space-y-6">
              <div>
                <label className="text-base font-semibold text-slate-700 block mb-2">Project Title</label>
                <input 
                  className="input-field py-3 text-lg" 
                  placeholder="e.g. Website Redesign"
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="text-base font-semibold text-slate-700 block mb-2">Description</label>
                <textarea 
                  className="input-field py-3 text-lg min-h-[120px]" 
                  placeholder="What is this project about?"
                  rows="3" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 text-lg font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;