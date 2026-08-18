import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, ShieldCheck, ShieldOff, Users, UserCheck, UserX } from 'lucide-react';
import { listUsers, updateUserStatus } from '../../services/adminService';
import { loadAuth } from '../../utils/authState';
import { useTranslation } from '../../utils/i18n/I18nContext';

const FIELD_CLASS =
  'rounded-xl border border-[var(--home-border)] bg-[var(--home-panel-deep)] text-[var(--home-text)] transition-colors focus:border-[var(--home-accent)] focus:outline-none';

function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

export default function UsersTable() {
  const { t } = useTranslation();
  const auth = loadAuth();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [isActive, setIsActive] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ users: [], page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    listUsers({ search, role, isActive, page, limit: 10 }, auth?.token)
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, isActive, page]);

  async function handleToggleRole(user) {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(t("Are you sure you want to change this user's role?"))) return;
    try {
      const updated = await updateUserStatus(user._id, { role: nextRole }, auth?.token);
      setData((prev) => ({ ...prev, users: prev.users.map((u) => (u._id === updated._id ? updated : u)) }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleActive(user) {
    if (!window.confirm(t("Are you sure you want to change this user's active status?"))) return;
    try {
      const updated = await updateUserStatus(user._id, { isActive: !user.isActive }, auth?.token);
      setData((prev) => ({ ...prev, users: prev.users.map((u) => (u._id === updated._id ? updated : u)) }));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-[var(--home-ink)]">
          <Users size={18} className="text-[var(--home-accent)]" aria-hidden="true" />
          {t('Users')}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--home-border)] bg-[var(--home-panel-deep)] px-3 py-1 text-xs font-bold text-[var(--home-accent)]">
          {data.total} {t('total')}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)] p-4 shadow-[var(--shadow-card)]">
        <label className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--home-text-muted)]" aria-hidden="true" />
          <input
            type="text"
            className={`${FIELD_CLASS} w-full py-2.5 pl-10 pr-4 text-sm placeholder:text-[var(--home-text-muted)]`}
            placeholder={t('Search by name or email')}
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          />
        </label>
        <select
          className={`${FIELD_CLASS} px-3 py-2.5 text-sm`}
          value={role}
          onChange={(e) => { setPage(1); setRole(e.target.value); }}
        >
          <option value="">{t('All roles')}</option>
          <option value="user">{t('Users')}</option>
          <option value="admin">{t('Admin')}</option>
        </select>
        <select
          className={`${FIELD_CLASS} px-3 py-2.5 text-sm`}
          value={isActive}
          onChange={(e) => { setPage(1); setIsActive(e.target.value); }}
        >
          <option value="">{t('All status')}</option>
          <option value="true">{t('Active')}</option>
          <option value="false">{t('Inactive')}</option>
        </select>
      </div>

      {error && <p className="text-sm font-semibold text-[#ff8fa3]">{error}</p>}

      <div className="panel-scroll overflow-x-auto rounded-[var(--radius-card)] border border-[var(--home-border)] bg-[var(--home-panel-deep)] shadow-[var(--shadow-card)]">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--home-border)] bg-black/15 text-left text-[var(--home-text-muted)]">
              <th className="px-4 py-3 font-semibold">{t('Name')}</th>
              <th className="px-4 py-3 font-semibold">{t('Email')}</th>
              <th className="px-4 py-3 font-semibold">{t('Role')}</th>
              <th className="px-4 py-3 font-semibold">{t('Status')}</th>
              <th className="px-4 py-3 font-semibold">{t('Action')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--home-text-muted)]">{t('Loading...')}</td></tr>
            ) : data.users.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-[var(--home-text-muted)]">{t('No users found')}</td></tr>
            ) : (
              data.users.map((user) => {
                const isSelf = user._id === auth?.user?._id;
                return (
                  <tr key={user._id} className="border-b border-[var(--home-border)] text-[var(--home-text)] transition-colors last:border-0 hover:bg-[rgba(255,255,255,0.03)]">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,221,0,0.14)] text-xs font-bold text-[var(--home-accent)]">
                          {initials(user.name)}
                        </span>
                        {user.name}
                        {isSelf && (
                          <span className="rounded-full bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--home-text-muted)]">{t('You', 'You')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--home-text-muted)]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.role === 'admin' ? 'bg-[rgba(255,221,0,0.18)] text-[var(--home-accent)]' : 'bg-[rgba(255,255,255,0.1)] text-[var(--home-text-muted)]'}`}>
                        {user.role === 'admin' ? t('Admin') : t('Users')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.isActive === false ? 'bg-[rgba(255,107,157,0.16)] text-[#ff8fa3]' : 'bg-[rgba(93,214,146,0.16)] text-[#5dd692]'}`}>
                        {user.isActive === false ? t('Inactive') : t('Active')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--home-border)] bg-transparent text-[var(--home-text)] transition-colors hover:bg-[rgba(255,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-30"
                          title={user.role === 'admin' ? t('Demote to user') : t('Promote to admin')}
                          aria-label={user.role === 'admin' ? t('Demote to user') : t('Promote to admin')}
                          disabled={isSelf}
                          onClick={() => handleToggleRole(user)}
                        >
                          {user.role === 'admin' ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                        </button>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--home-border)] bg-transparent text-[var(--home-text)] transition-colors hover:bg-[rgba(255,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-30"
                          title={user.isActive === false ? t('Activate') : t('Deactivate')}
                          aria-label={user.isActive === false ? t('Activate') : t('Deactivate')}
                          disabled={isSelf}
                          onClick={() => handleToggleActive(user)}
                        >
                          {user.isActive === false ? <UserCheck size={15} /> : <UserX size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
