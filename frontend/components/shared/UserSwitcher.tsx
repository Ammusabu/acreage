'use client';

import { useState } from 'react';
import { User, UserCheck } from 'lucide-react';

export function UserSwitcher() {
  const [userId, setUserId] = useState(6); // Default guest

  const switchUser = (id: number) => {
    setUserId(id);
    // You can store this in context or localStorage
    localStorage.setItem('userId', id.toString());
    // Reload to apply changes
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <User size={14} className="text-gray-500" />
      <select
        value={userId}
        onChange={(e) => switchUser(parseInt(e.target.value))}
        className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300"
      >
        <option value="6">👤 Alice (Guest)</option>
        <option value="7">👤 Bob (Guest)</option>
        <option value="1">🏠 Sarah (Host)</option>
        <option value="2">🏠 Michael (Host)</option>
      </select>
    </div>
  );
}
