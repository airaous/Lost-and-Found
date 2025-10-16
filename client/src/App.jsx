import { useState } from 'react';
import Feed from './components/Feed.jsx';
import PostForm from './components/PostForm.jsx';

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(Date.now());
  const [activeTab, setActiveTab] = useState('lost');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePostCreated = () => {
    setRefreshToken(Date.now());
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-campus-blue pb-24 pt-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-sm uppercase tracking-wide text-sky-200">DYPIU Campus Community</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Campus Lost &amp; Found</h1>
          <p className="mt-3 max-w-xl text-sky-100">
            Share missing belongings or report newly found items so they can be reunited with their owners quickly.
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center rounded-lg bg-campus-teal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
            onClick={() => setIsFormOpen(true)}
          >
            Report an Item
          </button>
        </div>
      </header>

      <main className="relative z-10 -mt-14 pb-20">
        <div className="mx-auto max-w-5xl px-4">
          <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <nav className="flex gap-2 rounded-full bg-slate-100 p-1">
                {[
                  { label: 'Lost Items', value: 'lost' },
                  { label: 'Found Items', value: 'found' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.value ? 'bg-white text-campus-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="relative w-full md:w-80">
                <label className="sr-only" htmlFor="search">
                  Search posts
                </label>
                <input
                  id="search"
                  type="search"
                  placeholder="Search by keyword…"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm shadow-inner focus:border-campus-teal focus:outline-none focus:ring-2 focus:ring-campus-teal/20"
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 text-slate-400 transition hover:text-slate-600"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Feed status={activeTab} refreshToken={refreshToken} searchTerm={searchTerm} />
            </div>
          </section>
        </div>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Report an Item</h2>
                <p className="text-sm text-slate-500">Fill in the details below to help the campus community.</p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close form"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              <PostForm
                onSuccess={handlePostCreated}
                onClose={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
