import { useLocation } from 'react-router-dom';

const PAGE_INFORMATION = {
  '/admin/users': {
    title: 'Users',
    description: 'Manage Pixel Panel user accounts and permissions.',
  },
  '/admin/progress': {
    title: 'Progress',
    description: 'View reading activity and platform progress.',
  },
  '/admin/favorites': {
    title: 'Favorites',
    description: 'Review the stories users save most often.',
  },
  '/admin/settings': {
    title: 'Settings',
    description: 'Manage administrator and platform settings.',
  },
  '/admin/help': {
    title: 'Help Center',
    description: 'Admin help and support information.',
  },
};

export default function AdminPlaceholderPage() {
  const { pathname } = useLocation();
  const page = PAGE_INFORMATION[pathname] ?? {
    title: 'Admin',
    description: 'Pixel Panel administration.',
  };

  return (
    <section className="admin-placeholder">
      <span>Admin dashboard</span>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <div>
        You can replace this placeholder with your full {page.title.toLowerCase()} page later.
      </div>
    </section>
  );
}