import PropTypes from 'prop-types';

const statusStyles = {
  lost: 'bg-rose-100 text-rose-700 border border-rose-200',
  found: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
};

export default function PostCard({ post }) {
  const created = new Date(post.createdAt ?? Date.now()).toLocaleString();
  const badgeStyle = statusStyles[post.status] ?? 'bg-slate-200 text-slate-700';

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
      <footer className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
        Contact: <span className="font-medium text-slate-700">{post.contactInfo}</span>
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
    contactInfo: PropTypes.string.isRequired,
    createdAt: PropTypes.string
  }).isRequired
};
