import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useBlogStore from '../store/blogStore';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentPost,
    categories,
    postsLoading,
    postsError,
    fetchPost,
    fetchCategories,
    updatePost,
    uploadPostImage,
  } = useBlogStore();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    published: false,
    featuredImage: '',
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const postId = useMemo(() => id, [id]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [fetchPost, postId]);

  useEffect(() => {
    if (currentPost && currentPost._id === postId) {
      setFormData({
        title: currentPost.title || '',
        excerpt: currentPost.excerpt || '',
        content: currentPost.content || '',
        category: currentPost.category?._id || '',
        tags: currentPost.tags?.join(', ') || '',
        published: currentPost.published ?? false,
        featuredImage: currentPost.featuredImage || '',
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [currentPost, postId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const tagsString = formData.tags ?? '';
      const tagsArray = tagsString
        .split(/[,#\s]+/)
        .map(tag => tag.trim())
        .filter(Boolean);

      let featuredImage = formData.featuredImage;

      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append('image', imageFile);
        const uploadResponse = await uploadPostImage(uploadForm);
        featuredImage = uploadResponse.data.url;
      }

      await updatePost(postId, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        published: formData.published,
        featuredImage,
      });

      navigate('/my-posts');
    } catch (err) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (!postId) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">Post ID is missing.</p>
      </div>
    );
  }

  if (postsLoading && !currentPost) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{postsError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select category</option>
            {categories?.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="tech, ai, blog"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <p className="text-sm text-gray-500 mt-1">Separate with commas, spaces, or #hashtags.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <div className="space-y-3">
            {imagePreview || formData.featuredImage ? (
              <img
                src={imagePreview || formData.featuredImage}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg border"
              />
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="w-full border rounded-lg px-4 py-2"
            />
            <input
              type="url"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, featuredImage: e.target.value }));
                setImageFile(null);
                setImagePreview('');
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <p className="text-sm text-gray-500">Upload a new image or paste an external URL.</p>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-sm font-medium">Published</label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
