import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Topbar.css';

const Topbar = ({ onBurgerClick, masjidName, userEmail, sidebarWidth = 72 }) => (
  <div
    className="topbar d-flex align-items-center justify-content-between px-4"
    style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)', maxWidth: '96%' }}>

    <div className="d-flex align-items-center gap-3 w-100 justify-content-between position-relative">
      <div>
      <button className="btn btn-link text-white fs-3 p-0 me-2 topbar-burger" onClick={onBurgerClick} style={{ lineHeight: 1 }}>
        <i className="fa fa-bars"></i>
      </button>
      <span className="topbar-masjid-name fw-semibold">{masjidName}</span>
      </div>
      <div className="topbar-user-email text-white fw-normal d-none d-sm-flex">
        {userEmail}
        <i className="fa fa-caret-down ms-2"></i>
      </div>
    </div>
  </div>
);

export default Topbar; 