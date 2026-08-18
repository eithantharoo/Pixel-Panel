import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { getAllStories, deleteStory } from '../../services/storyService';
import { loadAuth } from '../../utils/authState';
import { useTranslation } from '../../utils/i18n/I18nContext';
import StoryEditor from './StoryEditor';

export default function StoriesTable() {
  const { t } = useTranslation();
  const auth = loadAuth();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ stories: [], page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStory, setEditingStory] = useState(null); // null = "new story" mode

  function refresh() {
    setLoading(true);
    getAllStories({ page, limit: 10 })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    Promise.resolve().then(refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleCreated(story) {
    setEditingStory(story);
    refresh();
  }

  function handleUpdated(story) {
    setEditingStory(story);
    refresh();
  }

  async function handleDelete(story) {
    if (!window.confirm(t('Are you sure you want to delete this story? This cannot be undone.'))) return;
    try {
      await deleteStory(story._id, auth?.token);
      if (editingStory?._id === story._id) setEditingStory(null);
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <StoryEditor
        story={editingStory}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        onCancel={() => setEditingStory(null)}
        onChaptersChanged={refresh}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-[var(--home-ink)]">
          <BookOpen size={18} className="text-[var(--home-accent)]" aria-hidden="true" />
          {t('Published Stories')}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--home-border)] bg-[var(--home-panel-deep)] px-3 py-1 text-xs font-bold text-[var(--home-accent)]">
          <CheckCircle2 size={13} aria-hidden="true" />
          {data.total} {t('published')}
        </span>
      </div>

      {error && <p className="text-sm font-semibold text-[#ff8fa3]">{error}</p>}

      <div className="panel-scroll overflow-x-auto rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)] shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--home-border)] bg-black/15 text-left text-[var(--home-text-muted)]">
              <th className="px-4 py-3 font-semibold">{t('Title')}</th>
              <th className="px-4 py-3 font-semibold">{t('Author')}</th>
              <th className="px-4 py-3 font-semibold">{t('Genres')}</th>
              <th className="px-4 py-3 font-semibold">{t('Status')}</th>
              <th className="px-4 py-3 font-semibold">{t('Chapters')}</th>
              <th className="px-4 py-3 font-semibold">{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[var(--home-text-muted)]">{t('Loading...')}</td></tr>
            ) : data.stories.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-[var(--home-text-muted)]">{t('No stories found')}</td></tr>
            ) : (
              data.stories.map((story) => (
                <tr
                  key={story._id}
                  className={`border-b border-[var(--home-border)] text-[var(--home-text)] transition-colors last:border-0 hover:bg-[rgba(255,255,255,0.03)] ${
                    editingStory?._id === story._id ? 'bg-[rgba(255,221,0,0.06)]' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{story.title}</td>
                  <td className="px-4 py-3 text-[var(--home-text-muted)]">{story.author}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {story.genres?.slice(0, 2).map((g) => (
                        <span key={g} className="rounded-full bg-[rgba(155,112,189,0.16)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-lilac)]">
                          {t(g, g)}
                        </span>
                      ))}
                      {story.genres?.length > 2 && (
                        <span className="rounded-full bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-[11px] font-semibold text-[var(--home-text-muted)]">
                          +{story.genres.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      story.status === 'ongoing'
                        ? 'bg-[rgba(93,214,146,0.16)] text-[#5dd692]'
                        : story.status === 'completed'
                          ? 'bg-[rgba(77,245,255,0.14)] text-[#4df5ff]'
                          : 'bg-[rgba(255,255,255,0.1)] text-[var(--home-text-muted)]'
                    }`}>
                      {t(story.status.charAt(0).toUpperCase() + story.status.slice(1))}
                    </span>
                  </td>
                  <td className="px-4 py-3">{story.totalChapters}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--home-border)] bg-transparent text-[var(--home-text)] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                        aria-label={t('Edit')}
                        title={t('Edit')}
                        onClick={() => setEditingStory(story)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--home-border)] bg-transparent text-[#ff8fa3] transition-colors hover:bg-[rgba(255,107,157,0.1)]"
                        aria-label={t('Delete')}
                        title={t('Delete')}
                        onClick={() => handleDelete(story)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--home-text-muted)]">
        <span>{t('Page')} {data.page} / {data.totalPages || 1}</span>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--home-border)] bg-transparent text-[var(--home-text)] transition-colors hover:bg-[rgba(255,255,255,0.08)] disabled:pointer-events-none disabled:opacity-30"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label={t('Previous')}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--home-border)] bg-transparent text-[var(--home-text)] transition-colors hover:bg-[rgba(255,255,255,0.08)] disabled:pointer-events-none disabled:opacity-30"
            disabled={page >= (data.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
            aria-label={t('View all')}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
