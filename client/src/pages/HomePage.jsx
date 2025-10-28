import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import { PostSchema } from '../types';
import useBlogStore from '../store/blogStore';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    categories,
    fetchCategories,
    fetchPosts,
    filters,
    setFilters,
    clearFilters
  } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const newFilters = {
      category: category || '',
      search: search || '',
      published: true,
    };

    setFilters(newFilters);
    setSearchTerm(search || '');

    fetchPosts(newFilters);
  }, [searchParams, fetchPosts, setFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    fetchPosts(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    navigate(`/?${params.toString()}`);
  };

  const handleCategoryFilter = (categorySlug) => {
    const newFilters = { ...filters, category: categorySlug };
    setFilters(newFilters);
    fetchPosts(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    navigate(`/?${params.toString()}`);
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to MERN Blog</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A full-stack blog application built with MongoDB, Express.js, React, and Node.js
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <button
              onClick={() => {
                clearFilters();
                setSearchTerm('');
                navigate('/');
                fetchPosts();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                !filters.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  filters.category === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PostList onPostClick={handlePostClick} />
      </main>
    </div>
  );
};

export default HomePage;