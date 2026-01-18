import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/profile', formData);
      login(localStorage.getItem('token'), data); // Update context
      setMsg('Profile Updated Successfully');
    } catch (error) {
      setMsg('Update failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      {msg && <div className="bg-green-100 p-2 mb-4 text-green-700">{msg}</div>}
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <label>Name</label>
        <input 
          className="border p-2 rounded" value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        <label>Email</label>
        <input 
          className="border p-2 rounded" value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})} 
        />
        <button className="bg-blue-600 text-white p-2 rounded mt-2">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;