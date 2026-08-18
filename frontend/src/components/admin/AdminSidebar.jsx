import { ArrowLeft, LayoutGrid, Library, Users } from 'lucide-react';
import { loadAuth } from '../../utils/authState';
import { useTranslation } from '../../utils/i18n/I18nContext';

const TABS = [
  { id: 'overview', label: 'Overview', Icon: LayoutGrid },
  { id: 'users', label: 'Users', Icon: Users },
  { id: 'stories', label: 'Stories', Icon: Library },
];

export default function AdminSidebar({ activeTab, onTabChange, onExit }) {
  const { t } = useTranslation();
  const adminName = loadAuth()?.user?.name || t('Admin');

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col gap-1 rounded-r-[20px] bg-gradient-to-b from-[var(--home-panel)] to-[var(--home-panel-deep)] p-4 shadow-[var(--shadow-card)]">
      <div className="mb-7 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--home-accent)] to-[var(--accent-lilac)] text-[#2a1040] shadow-sm">
          <LayoutGrid size={18} aria-hidden="true" />
        </span>
        <span className="text-base font-extrabold leading-tight text-[var(--home-text)]">{t('Admin Dashboard')}</span>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Admin navigation">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`relative flex cursor-pointer items-center gap-3 rounded-[10px] border px-3 py-2.5 text-sm font-semibold transition-all ${
              activeTab === id
                ? 'border-[rgba(255,244,61,0.3)] bg-[rgba(255,244,61,0.14)] text-[var(--home-accent)] shadow-[inset_3px_0_0_var(--home-accent)]'
                : 'border-transparent bg-transparent text-[var(--home-text)] hover:border-[var(--home-border)] hover:bg-[rgba(234,219,238,0.12)] hover:text-[var(--home-accent)]'
            }`}
            aria-current={activeTab === id ? 'page' : undefined}
            onClick={() => onTabChange(id)}
          >
            <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
            <span>{t(label, label)}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 border-t border-[rgba(255,255,255,0.16)] pt-3">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-[10px] border border-transparent bg-transparent px-3 py-2.5 text-sm font-semibold text-[var(--home-text)] transition-all hover:border-[var(--home-border)] hover:bg-[rgba(234,219,238,0.12)] hover:text-[var(--home-accent)]"
          onClick={onExit}
        >
          <ArrowLeft size={18} strokeWidth={1.9} aria-hidden="true" />
          <span>{t('Home')}</span>
        </button>
        <div className="flex items-center gap-2 px-2 text-xs font-medium text-[var(--home-text-muted)]">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#5dd692]" aria-hidden="true" />
          <span className="truncate">{t('Admin')} · {adminName}</span>
        </div>
      </div>
    </aside>
  );
}
