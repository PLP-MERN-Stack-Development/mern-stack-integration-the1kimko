import { useEffect } from 'react';
import PostCard from './PostCard';
import { PostSchema } from '../types';
import useBlogStore from '../store/blogStore';

const PostList = ({ onPostClick }) => {
  const {
    posts,
    postsLoading,
    postsError,
    pagination,
    fetchPosts
  } = useBlogStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLoadMore = () => {
    if (pagination.page < pagination.pages) {
      fetchPosts({ page: pagination.page + 1 });
    }
  };

  if (postsLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Error: {postsError}</p>
        <button
          onClick={() => fetchPosts()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onReadMore={onPostClick}
          />
        ))}
      </div>

      {/* Load More Button */}
      {pagination.page < pagination.pages && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={postsLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {postsLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;