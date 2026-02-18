import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get the ID from URL
import API from '../api';

const SingleBlog = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`); // Fetch just this one blog
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading post...</div>;
  if (!blog) return <div className="text-center mt-10">Blog not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <img 
        src={blog.image || "https://via.placeholder.com/800x400"} 
        alt={blog.title} 
        className="w-full h-64 object-cover rounded-lg shadow-lg mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{blog.title}</h1>
      
      <div className="flex items-center text-gray-500 mb-6 text-sm">
        <span className="mr-4">📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{blog.category}</span>
      </div>

      <div className="prose lg:prose-xl text-gray-700 leading-relaxed">
        {/* We will render the content as paragraphs for now */}
        {blog.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default SingleBlog;