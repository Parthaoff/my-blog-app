import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={blog.image || "https://via.placeholder.com/150"} 
        alt={blog.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-xs font-bold text-blue-600 uppercase">{blog.category}</span>
        <h2 className="text-xl font-bold mt-2 text-gray-800">{blog.title}</h2>
        <p className="text-gray-600 mt-2 text-sm line-clamp-3">
          {blog.content.substring(0, 100)}...
        </p>
        <Link 
          to={`/blogs/${blog._id}`} 
          className="inline-block mt-4 text-blue-500 hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;