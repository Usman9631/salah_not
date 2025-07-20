import React, { useState } from 'react';



const LiveAzan = () => {
  
  const [youtubeLink, setYoutubeLink] = useState('');
  const [message, setMessage] = useState('');

  const handleGoLive = (e) => {
    e.preventDefault();
    alert('Go Live clicked!');
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 10,
      padding: 28,
      color: '#222',
      fontFamily: 'inherit',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, fontWeight: 600, color: '#222' }}>Go Live with Azan</h2>
      <form onSubmit={handleGoLive} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       
            
        {/* YouTube Live link */}
        <input
          type="text"
          placeholder="YouTube Live link"
          value={youtubeLink}
          onChange={e => setYoutubeLink(e.target.value)}
          style={{
            width: '100%',
            background: '#f7f7f7',
            border: '1px solid #ccc',
            borderRadius: 6,
            color: '#222',
            outline: 'none',
            padding: '8px 10px',
            fontSize: 15,
            marginBottom: 12,
            height: 44,
          }}
        />
        {/* Message (optional) */}
        <input
          type="text"
          placeholder="Message (optional)"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{
            width: '100%',
            background: '#f7f7f7',
            border: '1px solid #ccc',
            borderRadius: 6,
            color: '#222',
            outline: 'none',
            padding: '8px 10px',
            fontSize: 15,
            marginBottom: 18,
            height: 44,
          }}
        />
        {/* Go Live Button */}
        <button type="submit" style={{
          width: '100%',
          background: '#A7BD32',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '12px 0',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          height: 48,
        }}>
          GO LIVE
        </button>
      </form>
    </div>
  );
};

export default LiveAzan; 