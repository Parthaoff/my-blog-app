import React, { useEffect, useState } from 'react';
import API from '../api';
import axios from 'axios'; // We need standard axios for the image upload
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  
  // New state to hold the actual file selected by the user
  const [file, setFile] = useState(null); 
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '', // This will still store the URL string
    category: 'General'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchBlogs();
    }
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await API.delete(`/blogs/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (err) {
        alert("Failed to delete blog");
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image,
      category: blog.category
    });
    setFile(null); // Reset file input when editing starts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingBlog(null);
    setFormData({ title: '', content: '', image: '', category: 'General' });
    setFile(null);
  };

  // --- NEW: FUNCTION TO UPLOAD IMAGE TO CLOUDINARY ---
  const uploadImage = async () => {
    if (!file) return formData.image; // If no new file, return existing URL

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "blog_upload"); // <--- REPLACE WITH YOUR PRESET NAME
    data.append("cloud_name", "dqy2pt2gs"); // <--- REPLACE WITH YOUR CLOUD NAME

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dqy2pt2gs/image/upload", // <--- REPLACE WITH YOUR CLOUD NAME
        data
      );
      return res.data.secure_url; // Return the new Image URL
    } catch (error) {
      console.error("Image upload failed", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Upload image first (if there is one) and wait for the URL
      let imageUrl = formData.image;
      if (file) {
        alert("Uploading image... please wait.");
        imageUrl = await uploadImage();
      }

      const blogData = { ...formData, image: imageUrl };

      // 2. Save Blog to Backend
      if (editingBlog) {
        const res = await API.put(`/blogs/${editingBlog._id}`, blogData);
        setBlogs(blogs.map((b) => (b._id === editingBlog._id ? res.data : b)));
        alert('Blog Updated Successfully!');
        setEditingBlog(null);
      } else {
        const res = await API.post('/blogs', blogData);
        setBlogs([res.data, ...blogs]);
        alert('Blog Created Successfully!');
      }
      
      setFormData({ title: '', content: '', image: '', category: 'General' });
      setFile(null);
      
    } catch (err) {
      alert('Operation failed. Check console.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
      </div>

      {/* Form Section */}
      <div className={`mb-10 p-6 rounded-lg shadow-inner ${editingBlog ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          {editingBlog ? '✏️ Edit Post' : '✍️ Create New Post'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Blog Title" 
              className="w-full p-2 border rounded"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            
            {/* NEW FILE INPUT */}
            <input 
              type="file" 
              accept="image/*"
              className="w-full p-2 border rounded bg-white"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <input 
            type="text" 
            placeholder="Category" 
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          />

          <textarea 
            placeholder="Write your blog content here..." 
            className="w-full p-2 border rounded h-32"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
          ></textarea>

          <div className="flex gap-2">
            <button 
              type="submit" 
              className={`text-white px-6 py-2 rounded font-bold ${editingBlog ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {editingBlog ? 'Update Blog' : 'Publish Blog'}
            </button>
            
            {editingBlog && (
              <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <h2 className="text-2xl font-bold mb-4">Manage Posts ({blogs.length})</h2>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td className="px-5 py-5 border-b bg-white text-sm font-medium">{blog.title}</td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-5 border-b bg-white text-sm">
                  <button onClick={() => handleEdit(blog)} className="text-blue-600 hover:text-blue-900 font-bold mr-4">Edit</button>
                  <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:text-red-900 font-bold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;