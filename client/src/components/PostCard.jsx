const PostCard = ({ post, onReadMore }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <article className="card overflow-hidden group cursor-pointer" onClick={() => onReadMore(post)}>
      <div className="relative overflow-hidden">
        <img
          src={post.featuredImage || `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop`}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold text-white px-2.5 py-1 rounded-full"
            style={{ backgroundColor: post.category?.color || '#2563eb' }}
          >
            {post.category?.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{post.viewCount} views</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <img
              src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}&background=2563eb&color=fff`}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">{post.author?.name}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PostCard;