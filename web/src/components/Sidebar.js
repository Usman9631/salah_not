import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';

const menuItems = [
  { icon: 'fa-mosque', label: 'Masjid' },
  { icon: 'fa-praying-hands', label: 'Salah' },
  { icon: 'fa-clock', label: 'Iqamah & Jumah' },
  { icon: 'fa-cog', label: 'Screen Settings' },
  { icon: 'fa-comment-alt', label: 'Messages' },
  { icon: 'fa-handshake', label: 'Service / Contact' },
  { icon: 'fa-user', label: 'Manage Accounts' },
  { icon: 'fa-broadcast-tower', label: 'Live streaming' }, // New menu item
];

const Sidebar = ({ expanded, onMenuClick, activeIndex, onMouseEnter, onMouseLeave }) => {
  return (
    <div className={`sidebar${expanded ? ' expanded' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    > 
      {/* Logo removed as per user request */}
      <div className="sidebar-menu d-flex flex-column align-items-center gap-3 mt-4">
        {menuItems.map((item, idx) => (
          <div
            key={item.label}
            className={`sidebar-icon-btn${activeIndex === idx ? ' active' : ''}`}
            onClick={() => onMenuClick(idx)}
            title={item.label}
          >
            <div className="sidebar-icon rounded-circle d-flex align-items-center justify-content-center">
              <i className={`fa ${item.icon}`}></i>
            </div>
            {expanded && <span className="sidebar-label ms-3">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 