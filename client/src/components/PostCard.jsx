import { PostSchema } from '../types';

const PostCard = ({ post, onReadMore }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Featured Image */}
      <div className="h-48 bg-gray-200">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm font-medium text-white px-2 py-1 rounded"
            style={{ backgroundColor: post.category?.color || '#3B82F6' }}
          >
            {post.category?.name}
          </span>
          <span className="text-sm text-gray-500">
            {post.viewCount} views
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">{post.author?.name}</span>
          </div>
          <span className="text-sm text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onReadMore(post)}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Read More
        </button>
      </div>
    </article>
  );
};

export default PostCard;