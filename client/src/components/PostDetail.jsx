import { useEffect, useState } from 'react';
import { PostSchema } from '../types';
import useBlogStore from '../store/blogStore';
import useAuthStore from '../store/authStore';

const PostDetail = ({ postId, onBack }) => {
  const { currentPost, postsLoading, postsError, fetchPost, addComment } = useBlogStore();
  const { user } = useAuthStore();
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost(postId);
  }, [fetchPost, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setSubmittingComment(true);
    try {
      await addComment(postId, comment);
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (postsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (postsError || !currentPost) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">
          {postsError || 'Post not found'}
        </p>
        <button
          onClick={onBack}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Posts
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Featured Image */}
        <div className="h-64 bg-gray-200">
          <img
            src={currentPost.featuredImage}
            alt={currentPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm font-medium text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: currentPost.category?.color || '#3B82F6' }}
              >
                {currentPost.category?.name}
              </span>
              <span className="text-sm text-gray-500">
                {currentPost.viewCount} views
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentPost.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {currentPost.author?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentPost.createdAt)}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentPost.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {currentPost.content}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-6">
              Comments ({currentPost.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim() || submittingComment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <p className="text-gray-500 mb-8">
                Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to add a comment.
              </p>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {currentPost.comments?.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}

              {(!currentPost.comments || currentPost.comments.length === 0) && (
                <p className="text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;