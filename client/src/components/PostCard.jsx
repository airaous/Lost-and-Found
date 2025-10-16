import { useState } from 'react';
import PropTypes from 'prop-types';

const statusStyles = {
  lost: 'bg-rose-100 text-rose-700 border border-rose-200',
  found: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
};

export default function PostCard({ post, onUnlist }) {
  const [isUnlisting, setIsUnlisting] = useState(false);
  const [localError, setLocalError] = useState('');
  const created = new Date(post.createdAt ?? Date.now()).toLocaleString();
  const badgeStyle = statusStyles[post.status] ?? 'bg-slate-200 text-slate-700';

  const contactEmail = post.contactInfo?.trim();
  const contactPhone = post.contactPhone?.trim();

  const handleUnlist = async () => {
    if (!onUnlist || !post._id) {
      return;
    }

    setIsUnlisting(true);
    setLocalError('');

    try {
      await onUnlist(post._id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to unlist this post right now.';
      setLocalError(message);
    } finally {
      setIsUnlisting(false);
    }
  };

  return (
    <article className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeStyle}`}>
          {post.status === 'found' ? 'Found' : 'Lost'}
        </span>
        <time className="text-xs text-slate-500" dateTime={new Date(post.createdAt ?? Date.now()).toISOString()}>
          {created}
        </time>
      </header>
      <div className="space-y-3 px-4 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{post.itemName}</h3>
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">Location:</span> {post.location}
        </p>
        {post.description && <p className="text-sm text-slate-600 whitespace-pre-line">{post.description}</p>}
      </div>
      <footer className="space-y-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
        <div className="space-y-1">
          {contactEmail ? (
            <p>
              <span className="font-medium text-slate-700">Email:</span>{' '}
              <a className="text-campus-teal hover:underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </p>
          ) : (
            <p className="text-xs text-slate-400">No email provided.</p>
          )}
          {contactPhone && (
            <p>
              <span className="font-medium text-slate-700">Phone:</span>{' '}
              <a className="text-campus-teal hover:underline" href={`tel:${contactPhone}`}>
                {contactPhone}
              </a>
            </p>
          )}
        </div>

        {localError && <p className="rounded-md bg-rose-100 px-3 py-2 text-xs text-rose-700">{localError}</p>}

        {onUnlist && post._id && (
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            onClick={handleUnlist}
            disabled={isUnlisting}
          >
            {isUnlisting ? 'Unlisting…' : 'Mark as Claimed'}
          </button>
        )}
      </footer>
    </article>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string.isRequired,
    contactInfo: PropTypes.string,
    contactPhone: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired,
  onUnlist: PropTypes.func
};
