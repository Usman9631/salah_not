import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MasjidForm from './MasjidForm';
import SalahTiming from './SalahTiming';
import IqamahJumah from './IqamahJumah';
import ScreenSettings from './ScreenSettings';
import Messages from './Messages';
import ServicesContact from './ServicesContact';
import LiveAzan from './LiveAzan';

const DashboardLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0); // 0 = Masjid

  // Add mouse event handlers for sidebar hover
  const handleSidebarMouseEnter = () => setSidebarExpanded(true);
  const handleSidebarMouseLeave = () => setSidebarExpanded(false);

  // You can add more components for other menu items
  const renderContent = () => {
    if (activeMenu === 0) return <MasjidForm />;
    if (activeMenu === 1) return <SalahTiming onScreenSettingsClick={() => setActiveMenu(3)} />;
    if (activeMenu === 2) return <IqamahJumah onScreenSettingsClick={() => setActiveMenu(3)} />;
    if (activeMenu === 3) return <ScreenSettings />;
    if (activeMenu === 4) return <Messages />;
    if (activeMenu === 5) return <ServicesContact />;
    if (activeMenu === 7) return <LiveAzan />;
    return <div className="p-4">Coming soon...</div>;
  };

  const sidebarWidth = sidebarExpanded ? 220 : 72;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
      <Sidebar 
        expanded={sidebarExpanded} 
        onMenuClick={setActiveMenu} 
        activeIndex={activeMenu}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      />
      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.25s cubic-bezier(.4,0,.2,1)', maxWidth: '96%' }}>
        <Topbar
          onBurgerClick={() => setSidebarExpanded(e => !e)}
          masjidName="Hull Mosque & Islamic Centre"
          userEmail="admin@hullmosque.com"
          sidebarWidth={sidebarWidth}
        />
        <div className="main-content" style={{ paddingLeft: 16, paddingRight: 16, maxWidth: 1400, margin: '0 auto' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 