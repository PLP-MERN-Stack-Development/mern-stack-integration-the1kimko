import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import useBlogStore from '../store/blogStore';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    categories,
    // fetchCategories,
    fetchPosts,
    filters,
    setFilters,
    clearFilters
  } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('HomePage: Fetching posts...');  // ← DEBUG
    // fetchCategories();

    const params = {
      published: true,
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
    };

    fetchPosts(params);
  }, [searchParams, fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = { ...filters, search: searchTerm, published: true };
    setFilters(params);
    fetchPosts(params);

    const urlParams = new URLSearchParams();
    if (params.category) urlParams.set('category', params.category);
    if (params.search) urlParams.set('search', params.search);
    navigate(`/?${urlParams.toString()}`);
  };

  const handleCategoryFilter = (categorySlug) => {
    const params = { ...filters, category: categorySlug, published: true };
    setFilters(params);
    fetchPosts(params);

    const urlParams = new URLSearchParams();
    if (params.category) urlParams.set('category', params.category);
    if (params.search) urlParams.set('search', params.search);
    navigate(`/?${urlParams.toString()}`);
  };

  const handleClear = () => {
    clearFilters();
    setSearchTerm('');
    navigate('/');
    fetchPosts({ published: true });
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post._id}`);
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
              onClick={handleClear}
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
                key={category._id}
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