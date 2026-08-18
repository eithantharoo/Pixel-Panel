import React, { useState } from 'react';
import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountMenu() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  function handleProfile() {
    setOpen(false);

    navigate('/profile');
  }

  function handleSettings() {
    setOpen(false);

    navigate('/settings');
  }

  function handleLogout() {
    setOpen(false);

    // Later:
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');

    navigate('/');
  }

  return (
    <div className="relative">
      {/* ACCOUNT BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          min-h-[44px]
          items-center
          gap-2
          rounded-xl
          bg-[#ead9f7]
          px-3
          py-2
          text-[#35164f]
          transition
          hover:bg-[#ddc3f0]
        "
      >
        <img
          src="/images/44234cc2b1f391c26eddaf614bd9b90c8e7a14a4.jpg"
          alt="Hsu Myat"
          className="
            h-8
            w-8
            rounded-full
            object-cover
          "
        />

        <span
          className="
            hidden
            max-w-[120px]
            truncate
            text-sm
            font-bold
            sm:block
          "
        >
          Hsu Myat
        </span>

        <ChevronDown
          size={16}
          className={`
            transition-transform
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* ACCOUNT DROPDOWN */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-[54px]
            z-50
            w-[220px]
            overflow-hidden
            rounded-2xl
            border
            border-purple-200
            bg-white
            py-2
            shadow-2xl
          "
        >
          <div
            className="
              border-b
              border-purple-100
              px-4
              py-3
            "
          >
            <p className="font-extrabold text-[#35164f]">
              Hsu Myat
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              Reader account
            </p>
          </div>

          <button
            type="button"
            onClick={handleProfile}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-sm
              font-semibold
              text-[#35164f]
              transition
              hover:bg-purple-50
            "
          >
            <User size={17} />

            My Profile
          </button>

          <button
            type="button"
            onClick={handleSettings}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-sm
              font-semibold
              text-[#35164f]
              transition
              hover:bg-purple-50
            "
          >
            <Settings size={17} />

            Settings
          </button>

          <div className="my-1 border-t border-purple-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-sm
              font-semibold
              text-red-500
              transition
              hover:bg-red-50
            "
          >
            <LogOut size={17} />

            Log Out
          </button>
        </div>
      )}
    </div>
  );
}