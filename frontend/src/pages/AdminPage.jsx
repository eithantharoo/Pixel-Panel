import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatsOverview from '../components/admin/StatsOverview';
import UsersTable from '../components/admin/UsersTable';
import StoriesTable from '../components/admin/StoriesTable';
import { useTranslation } from '../utils/i18n/I18nContext';
import './AdminPage.css';

const TAB_META = {
  overview: { label: 'Overview', subtitle: 'A snapshot of users, stories, and engagement.' },
  users: { label: 'Users', subtitle: 'Search, filter, and manage accounts.' },
  stories: { label: 'Stories', subtitle: 'Create and manage stories and their chapters.' },
};

export default function AdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const meta = TAB_META[activeTab];
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="admin-page flex h-screen w-full">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onExit={() => navigate('/home')} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[var(--home-border)] px-6 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--home-ink)]">
              {t(meta.label, meta.label)}
            </h1>
            <p className="mt-1 text-sm text-[var(--home-ink)] opacity-65">{t(meta.subtitle, meta.subtitle)}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--home-border)] bg-[var(--home-panel-deep)] px-4 py-2 text-xs font-semibold text-[var(--home-text)] shadow-[var(--shadow-card)]">
            <CalendarDays size={14} className="text-[var(--home-accent)]" aria-hidden="true" />
            {todayLabel}
          </span>
        </header>

        <main className="panel-scroll min-w-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto w-full max-w-6xl">
            {activeTab === 'overview' && <StatsOverview />}
            {activeTab === 'users' && <UsersTable />}
            {activeTab === 'stories' && <StoriesTable />}
          </div>
        </main>
      </div>
    </div>
  );
}
