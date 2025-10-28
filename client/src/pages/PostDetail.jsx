import { useParams, useNavigate } from 'react-router-dom';
import PostDetail from '../components/PostDetail';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Post ID not provided</p>
        <button
          onClick={handleBack}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return <PostDetail postId={id} onBack={handleBack} />;
};

export default PostDetailPage;