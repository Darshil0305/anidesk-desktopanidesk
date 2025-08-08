import React from 'react';
import { SidebarProps } from '../types';

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange
}) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'search', label: 'Search', icon: '🔍' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>AniDesk</h2>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activeView === item.id ? 'active' : ''
            }`}
            onClick={() => onViewChange(item.id as 'home' | 'trending' | 'search')}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
