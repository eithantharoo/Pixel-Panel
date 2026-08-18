import { useMemo, useState } from 'react';
import {
  Check,
  Edit3,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import './AdminStoriesPage.css';

const GENRES = [
  'Mystery', 'Romance', 'Comedy', 'Fantasy', 'Horror', 'Drama', 'Sci-Fi',
  'Historical', 'Slice of Life', 'Thriller', 'School', 'Adventure',
];

const INITIAL_CHAPTERS = [
  { id: 1, number: 1, title: 'The Awakening', content: 'The end of the dream.', status: 'Published' },
  { id: 2, number: 2, title: 'Whispers in the Dark', content: '', status: 'Published' },
  { id: 3, number: 3, title: "The Keeper's Secret", content: '', status: 'Draft' },
];

const PUBLISHED_STORIES = [
  { id: 1, title: 'The Last Ember', author: 'Elena Voss', genres: ['Fantasy', 'Adventure'], status: 'Ongoing', chapters: 12, views: '1.2k' },
  { id: 2, title: 'Silent Stars', author: 'Marcus Thorne', genres: ['Sci-Fi', 'Drama'], status: 'Completed', chapters: 24, views: '3.4k' },
  { id: 3, title: 'Beneath the Veil', author: 'Lina Cruz', genres: ['Mystery', 'Thriller'], status: 'Ongoing', chapters: 8, views: '890' },
];

const EMPTY_STORY = {
  title: '',
  description: '',
  coverUrl: '',
  author: '',
  status: 'Ongoing',
  featured: 'No',
  genres: [],
};

function ChapterEditor({ chapter, onChange, onAdd }) {
  return (
    <section className="chapter-editor">
      <div className="form-field form-field--small">
        <label htmlFor="chapter-number">Number *</label>
        <input id="chapter-number" type="number" min="1" value={chapter.number} onChange={(e) => onChange({ ...chapter, number: e.target.value })} />
      </div>
      <div className="form-field">
        <label htmlFor="chapter-title">Title *</label>
        <input id="chapter-title" value={chapter.title} onChange={(e) => onChange({ ...chapter, title: e.target.value })} placeholder="Chapter title" />
      </div>
      <div className="form-field form-field--wide">
        <label htmlFor="chapter-content">Content (optional)</label>
        <input id="chapter-content" value={chapter.content} onChange={(e) => onChange({ ...chapter, content: e.target.value })} placeholder="Short chapter note or content URL" />
      </div>
      <button className="button button--secondary chapter-editor__add" type="button" onClick={onAdd}>
        <Plus size={17} /> Add chapter
      </button>
    </section>
  );
}

function AdminStoriesPage() {
  const [story, setStory] = useState(EMPTY_STORY);
  const [chapters, setChapters] = useState(INITIAL_CHAPTERS);
  const [editingId, setEditingId] = useState(null);
  const [chapterDraft, setChapterDraft] = useState({ number: 4, title: '', content: '', status: 'Draft' });
  const [message, setMessage] = useState('');

  const nextChapterNumber = useMemo(
    () => Math.max(0, ...chapters.map((chapter) => Number(chapter.number))) + 1,
    [chapters],
  );

  function updateStory(field, value) {
    setStory((current) => ({ ...current, [field]: value }));
  }

  function toggleGenre(genre) {
    setStory((current) => ({
      ...current,
      genres: current.genres.includes(genre)
        ? current.genres.filter((item) => item !== genre)
        : [...current.genres, genre],
    }));
  }

  function saveChapter() {
    if (!String(chapterDraft.number).trim() || !chapterDraft.title.trim()) {
      setMessage('Please enter the chapter number and title.');
      return;
    }

    if (editingId !== null) {
      setChapters((current) => current.map((item) => (
        item.id === editingId ? { ...chapterDraft, id: editingId } : item
      )));
    } else {
      setChapters((current) => [...current, { ...chapterDraft, id: Date.now() }]);
    }

    setEditingId(null);
    setChapterDraft({ number: nextChapterNumber + (editingId === null ? 1 : 0), title: '', content: '', status: 'Draft' });
    setMessage('Chapter saved.');
  }

  function editChapter(chapter) {
    setEditingId(chapter.id);
    setChapterDraft({ ...chapter });
    setMessage('');
  }

  function deleteChapter(id) {
    setChapters((current) => current.filter((chapter) => chapter.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setChapterDraft({ number: nextChapterNumber, title: '', content: '', status: 'Draft' });
    }
  }

  function resetForm() {
    setStory(EMPTY_STORY);
    setChapters(INITIAL_CHAPTERS);
    setEditingId(null);
    setChapterDraft({ number: 4, title: '', content: '', status: 'Draft' });
    setMessage('Form reset.');
  }

  function publishStory(event) {
    event.preventDefault();
    if (!story.title.trim() || !story.description.trim() || !story.coverUrl.trim() || story.genres.length === 0) {
      setMessage('Complete all required fields and select at least one genre.');
      return;
    }
    setMessage(`“${story.title}” is ready to send to your backend.`);
  }

  return (
    <>
          <div className="page-heading">
            <div>
              <span className="page-heading__eyebrow">Content management</span>
              <h1>Upload New Story</h1>
              <p>Create the story details, organize chapters, then publish when everything is ready.</p>
            </div>
            <span className="admin-only-badge"><Check size={15} /> Admin only</span>
          </div>

          <form className="story-card" onSubmit={publishStory}>
            <div className="story-form-grid">
              <div className="form-field form-field--full">
                <label htmlFor="story-title">Title *</label>
                <input id="story-title" value={story.title} onChange={(e) => updateStory('title', e.target.value)} placeholder="Enter manga title" />
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="story-description">Description *</label>
                <textarea id="story-description" rows="5" value={story.description} onChange={(e) => updateStory('description', e.target.value)} placeholder="Write a short description" />
              </div>

              <div className="form-field">
                <label htmlFor="cover-url">Cover URL *</label>
                <input id="cover-url" type="url" value={story.coverUrl} onChange={(e) => updateStory('coverUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div className="form-field">
                <label htmlFor="author">Author</label>
                <input id="author" value={story.author} onChange={(e) => updateStory('author', e.target.value)} placeholder="Author name" />
              </div>
              <div className="form-field">
                <label htmlFor="status">Status</label>
                <select id="status" value={story.status} onChange={(e) => updateStory('status', e.target.value)}>
                  <option>Ongoing</option><option>Completed</option><option>Hiatus</option><option>Draft</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="featured">Featured</label>
                <select id="featured" value={story.featured} onChange={(e) => updateStory('featured', e.target.value)}>
                  <option>No</option><option>Yes</option>
                </select>
              </div>
            </div>

            <fieldset className="genre-fieldset">
              <legend>Genres <span>(select at least one)</span></legend>
              <div className="genre-grid">
                {GENRES.map((genre) => {
                  const selected = story.genres.includes(genre);
                  return (
                    <button key={genre} className={`genre-chip${selected ? ' is-selected' : ''}`} type="button" aria-pressed={selected} onClick={() => toggleGenre(genre)}>
                      {selected && <Check size={14} />} {genre}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <section className="chapters-section">
              <div className="section-title">
                <div><h2>Chapters</h2><p>Add, edit, or remove chapters before publishing.</p></div>
                <span>{chapters.length} total</span>
              </div>

              <div className="chapter-list">
                {chapters.map((chapter) => (
                  <div className="chapter-row" key={chapter.id}>
                    <strong>#{chapter.number}</strong>
                    <span className="chapter-row__title">{chapter.title}</span>
                    <span className={`status-pill status-pill--${chapter.status.toLowerCase()}`}>{chapter.status}</span>
                    <button type="button" onClick={() => editChapter(chapter)} aria-label={`Edit ${chapter.title}`}><Edit3 size={17} /></button>
                    <button className="chapter-row__delete" type="button" onClick={() => deleteChapter(chapter.id)} aria-label={`Delete ${chapter.title}`}><Trash2 size={17} /></button>
                  </div>
                ))}
              </div>

              <ChapterEditor chapter={chapterDraft} onChange={setChapterDraft} onAdd={saveChapter} />
            </section>

            {message && <p className="form-message" role="status">{message}</p>}

            <div className="form-actions">
              <button className="button button--secondary" type="button" onClick={resetForm}><RotateCcw size={17} /> Reset</button>
              <button className="button button--primary" type="submit"><Upload size={17} /> Publish Story</button>
            </div>
          </form>

          <section className="published-card">
            <div className="section-title">
              <div><h2>Published Stories</h2><p>Recently managed titles on Pixel Panel.</p></div>
              <span>{PUBLISHED_STORIES.length} stories</span>
            </div>
            <div className="stories-table-wrap">
              <table className="stories-table">
                <thead><tr><th>Title</th><th>Author</th><th>Genres</th><th>Status</th><th>Chapters</th><th>Views</th></tr></thead>
                <tbody>
                  {PUBLISHED_STORIES.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.title}</strong></td><td>{item.author}</td>
                      <td><div className="table-genres">{item.genres.map((genre) => <span key={genre}>{genre}</span>)}</div></td>
                      <td><span className={`status-pill status-pill--${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td>{item.chapters}</td><td>{item.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
    </>
  );
}

export default AdminStoriesPage;