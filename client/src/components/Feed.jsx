import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PostCard from './PostCard.jsx';
import { getApiBaseUrl } from '../utils/api.js';

const apiBaseUrl = getApiBaseUrl();

export default function Feed({ status, refreshToken, searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      setIsLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        if (status) {
          params.append('status', status);
        }
        if (searchTerm && searchTerm.trim()) {
          params.append('q', searchTerm.trim());
        }
        const query = params.toString();
        const response = await fetch(`${apiBaseUrl}/api/posts${query ? `?${query}` : ''}`);
        if (!response.ok) {
          throw new Error('Unable to load posts right now.');
        }

        const data = await response.json();
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Unexpected error while loading posts.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [status, refreshToken, searchTerm]);

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading {status ?? 'latest'} posts…</p>;
  }

  if (error) {
    return <p className="rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>;
  }

  if (!posts.length) {
    if (searchTerm?.trim()) {
      return (
        <p className="text-sm text-slate-500">
          No matches for “{searchTerm.trim()}”. Try a different keyword.
        </p>
      );
    }
    return <p className="text-sm text-slate-500">No {status ?? ''} items yet. Be the first to add one!</p>;
  }

  const handleUnlist = async (postId) => {
    const response = await fetch(`${apiBaseUrl}/api/posts/${postId}/unlist`, {
      method: 'PATCH'
    });

    if (!response.ok) {
      const message = response.status === 404 ? 'This post was already removed.' : 'Unable to mark this post as claimed.';
      throw new Error(message);
    }

    setPosts((previous) => previous.filter((post) => post._id !== postId));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post._id ?? post.itemName} post={post} onUnlist={handleUnlist} />
      ))}
    </div>
  );
}

Feed.propTypes = {
  status: PropTypes.oneOf(['lost', 'found', undefined]),
  refreshToken: PropTypes.number,
  searchTerm: PropTypes.string
};
