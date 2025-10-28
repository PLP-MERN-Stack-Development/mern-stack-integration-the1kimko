import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useBlogStore from '../store/blogStore';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { categories, fetchCategories } = useBlogStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useState(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">MERN Blog</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </a>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Categories
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories?.map((category) => (
                  <a
                    key={category.id}
                    href={`/?category=${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>

            {isAuthenticated() ? (
              <>
                <a href="/create-post" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Create Post
                </a>

                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    <span>{user?.name}</span>
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </a>
                    <a href="/my-posts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Posts
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </a>
                <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Sign Up
                </a>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>

              {categories?.map((category) => (
                <a
                  key={category.id}
                  href={`/?category=${category.slug}`}
                  className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                >
                  {category.name}
                </a>
              ))}

              {isAuthenticated() ? (
                <>
                  <a href="/create-post" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                    Create Post
                  </a>
                  <a href="/profile" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                    Profile
                  </a>
                  <a href="/my-posts" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                    My Posts
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </a>
                  <a href="/register" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;