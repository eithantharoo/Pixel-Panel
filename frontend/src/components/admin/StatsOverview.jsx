import { useEffect, useState } from 'react';
import { Bookmark, Eye, Layers, ShieldCheck, UserX, Users } from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';
import { loadAuth } from '../../utils/authState';
import { useTranslation } from '../../utils/i18n/I18nContext';

const CARD_DEFS = [
  { key: 'totalUsers', label: 'Total Users', Icon: Users, accent: '#ffdd00' },
  { key: 'inactiveUsers', label: 'Inactive Users', Icon: UserX, accent: '#ff8fa3' },
  { key: 'adminUsers', label: 'Admins', Icon: ShieldCheck, accent: '#5dd692' },
  { key: 'totalStories', label: 'Total Stories', Icon: Bookmark, accent: '#9b70bd' },
  { key: 'totalChapters', label: 'Total Chapters', Icon: Layers, accent: '#4df5ff' },
  { key: 'totalViews', label: 'Total Views', Icon: Eye, accent: '#ffdd00' },
];

export default function StatsOverview() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = loadAuth()?.token;
    getDashboardStats(token)
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => { if (!cancelled) setStats(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_DEFS.map(({ key }) => (
          <div
            key={key}
            className="h-[84px] animate-pulse rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)]"
          />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-[var(--home-text-muted)]">{t('Something went wrong')}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARD_DEFS.map(({ key, label, Icon, accent }) => (
        <div
          key={key}
          className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)] p-5 shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accent}24`, color: accent }}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-extrabold text-[var(--home-text)]">{stats[key] ?? 0}</p>
            <p className="truncate text-sm font-medium text-[var(--home-text-muted)]">{t(label, label)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
