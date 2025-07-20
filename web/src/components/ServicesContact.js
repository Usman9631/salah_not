import React, { useState } from 'react';
import './CustomTheme.css';

const ServicesContact = () => {
  const [tab, setTab] = useState('Services');
  const [english, setEnglish] = useState('');
  const [arabic, setArabic] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const handleSave = () => {
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm" style={{ minHeight: 400 }}>
      <div className="d-flex border-bottom mb-4">
        <button
          className={`btn btn-link px-3 py-2 ${tab === 'Services' ? 'fw-bold text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
          style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          onClick={() => setTab('Services')}
        >
          Services
        </button>
        <button
          className={`btn btn-link px-3 py-2 ${tab === 'Contact' ? 'fw-bold text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
          style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          onClick={() => setTab('Contact')}
        >
          Contact
        </button>
      </div>
      {tab === 'Services' && (
        <div>
          <h4 className="fw-semibold mb-1">Services</h4>
          <div className="text-muted mb-4">Please add services that the masjid offers</div>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Add services text in English with Start and Sunrise</label>
              <textarea
                className="form-control"
                rows={7}
                value={english}
                onChange={e => setEnglish(e.target.value)}
                placeholder="Enter services in English..."
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Add services text in Arabic</label>
              <textarea
                className="form-control"
                rows={7}
                value={arabic}
                onChange={e => setArabic(e.target.value)}
                placeholder="Enter services in Arabic..."
              />
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center mt-4">
            <button className="btn btn-info text-white px-4 fw-semibold" style={{ fontSize: '1.1rem' }} onClick={handleSave}>Save</button>
          </div>
          {saveMsg && <div className="alert alert-success mt-3 py-2 px-3">{saveMsg}</div>}
        </div>
      )}
      {tab === 'Contact' && (
        <div>
          <h4 className="fw-semibold mb-1">Contact</h4>
          <div className="text-muted mb-4">Add your masjid contact details</div>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Add text in English with Start and Sunrise</label>
              <textarea
                className="form-control"
                rows={7}
                value={english}
                onChange={e => setEnglish(e.target.value)}
                placeholder="Enter contact in English..."
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Add text in Arabic</label>
              <textarea
                className="form-control"
                rows={7}
                value={arabic}
                onChange={e => setArabic(e.target.value)}
                placeholder="Enter contact in Arabic..."
              />
            </div>
          </div>
          <div className="d-flex justify-content-end align-items-center mt-4">
            <button className="btn btn-info text-white px-4 fw-semibold" style={{ fontSize: '1.1rem' }} onClick={handleSave}>Save</button>
          </div>
          {saveMsg && <div className="alert alert-success mt-3 py-2 px-3">{saveMsg}</div>}
        </div>
      )}
    </div>
  );
};

export default ServicesContact; 