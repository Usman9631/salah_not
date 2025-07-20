import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const months = [
  'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
  'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'
];

const tabs = [
  'Salah Timing',
  'Upload / Download Timings',
  'Copy Time',
  'Diyanet salah timings (Turkish)'
];

const initialSalahData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  weekday: ['SUN','MON','TUE','WED','THU','FRI','SAT'][(new Date(2025, 6, i + 1)).getDay()],
  fajr: { adhan: '02:5' + (i % 10), iqamah: '03:4' + (i % 10) },
  shouruq: '04:' + (30 + i % 10),
  dhuhr: { adhan: '13:1' + (5 + i % 2), iqamah: '13:4' + (i % 2) },
  asr: { adhan: '17:3' + (2 + i % 2), iqamah: '18:5' + (0 + i % 2) },
  maghrib: { adhan: '21:4' + (0 + i % 2), iqamah: '21:4' + (0 + i % 2) },
  isha: { adhan: '22:5' + (5 + i % 2), iqamah: '23:1' + (0 + i % 2) },
}));

const SalahTiming = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('July 2025');
  const [salahData, setSalahData] = useState(initialSalahData);
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [specifyIqamah, setSpecifyIqamah] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('screenSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSpecifyIqamah(!!parsed.specifyIqamah);
      } catch {}
    }
  }, []);

  const handleEdit = idx => {
    setEditIdx(idx);
    setEditRow(JSON.parse(JSON.stringify(salahData[idx])));
  };

  const handleEditChange = (field, subfield, value) => {
    setEditRow(row => {
      const updated = { ...row };
      if (subfield) {
        updated[field][subfield] = value;
      } else {
        updated[field] = value;
      }
      return updated;
    });
  };

  const handleSave = idx => {
    setSalahData(data => data.map((row, i) => (i === idx ? editRow : row)));
    setEditIdx(null);
    setEditRow(null);
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditRow(null);
  };

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm" style={{ minHeight: 600 }}>
      {/* Tabs and Month Dropdown */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 border-bottom pb-2">
        <div className="nav nav-tabs border-0">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`nav-link border-0 ${activeTab === idx ? 'active fw-bold' : 'text-dark'}`}
              style={{ background: 'none', fontSize: '1.08rem' }}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>
        <select
          className="form-select ms-2"
          style={{ maxWidth: 180 }}
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      {/* Salah Timing Table */}
      {activeTab === 0 && (
        <div>
          {/* Removed specifyIqamah alert as per user request */}
          <div className="mb-2">
            <h5 className="fw-semibold mb-0">Salah timing</h5>
            <div className="text-muted" style={{ fontSize: '1rem' }}>Set salah times by month</div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle" style={{ minWidth: 1100 }}>
              <thead className="table-light">
                <tr>
                  <th>DAY</th>
                  <th>FAJR</th>
                  <th>SHOURUQ</th>
                  <th>DHUHR</th>
                  <th>ASR</th>
                  <th>MAGHRIB</th>
                  <th>ISHA</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {salahData.map((row, idx) => (
                  <tr key={row.day} className={idx % 2 === 1 ? 'bg-light' : ''}>
                    <td>
                      <span className="text-uppercase text-warning" style={{ fontWeight: 600, fontSize: '0.95rem' }}>{row.weekday}</span><br />
                      <span>{row.day}</span>
                    </td>
                    {/* FAJR */}
                    <td>
                      {editIdx === idx ? (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          <input type="time" value={editRow.fajr.adhan} onChange={e => handleEditChange('fajr', 'adhan', e.target.value)} className="form-control form-control-sm mb-1" style={{ width: 110, display: 'inline-block' }} />
                          <br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          <input type="time" value={editRow.fajr.iqamah} onChange={e => handleEditChange('fajr', 'iqamah', e.target.value)} className="form-control form-control-sm" style={{ width: 110, display: 'inline-block' }} />
                        </>
                      ) : (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          {row.fajr.adhan}<br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          {row.fajr.iqamah}
                        </>
                      )}
                    </td>
                    {/* SHOURUQ */}
                    <td>
                      {editIdx === idx ? (
                        <input type="time" value={editRow.shouruq} onChange={e => handleEditChange('shouruq', null, e.target.value)} className="form-control form-control-sm" style={{ width: 110, display: 'inline-block' }} />
                      ) : (
                        row.shouruq
                      )}
                    </td>
                    {/* DHUHR */}
                    <td>
                      {editIdx === idx ? (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          <input type="time" value={editRow.dhuhr.adhan} onChange={e => handleEditChange('dhuhr', 'adhan', e.target.value)} className="form-control form-control-sm mb-1" style={{ width: 110, display: 'inline-block' }} />
                          <br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          <input type="time" value={editRow.dhuhr.iqamah} onChange={e => handleEditChange('dhuhr', 'iqamah', e.target.value)} className="form-control form-control-sm" style={{ width: 110, display: 'inline-block' }} />
                        </>
                      ) : (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          {row.dhuhr.adhan}<br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          {row.dhuhr.iqamah}
                        </>
                      )}
                    </td>
                    {/* ASR */}
                    <td>
                      {editIdx === idx ? (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          <input type="time" value={editRow.asr.adhan} onChange={e => handleEditChange('asr', 'adhan', e.target.value)} className="form-control form-control-sm mb-1" style={{ width: 110, display: 'inline-block' }} />
                          <br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          <input type="time" value={editRow.asr.iqamah} onChange={e => handleEditChange('asr', 'iqamah', e.target.value)} className="form-control form-control-sm" style={{ width: 110, display: 'inline-block' }} />
                        </>
                      ) : (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          {row.asr.adhan}<br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          {row.asr.iqamah}
                        </>
                      )}
                    </td>
                    {/* MAGHRIB */}
                    <td>
                      {editIdx === idx ? (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          <input type="time" value={editRow.maghrib.adhan} onChange={e => handleEditChange('maghrib', 'adhan', e.target.value)} className="form-control form-control-sm mb-1" style={{ width: 110, display: 'inline-block' }} />
                          <br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          <input type="time" value={editRow.maghrib.iqamah} onChange={e => handleEditChange('maghrib', 'iqamah', e.target.value)} className="form-control form-control-sm" style={{ width: 110, display: 'inline-block' }} />
                        </>
                      ) : (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          {row.maghrib.adhan}<br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          {row.maghrib.iqamah}
                        </>
                      )}
                    </td>
                    {/* ISHA */}
                    <td>
                      {editIdx === idx ? (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          <input type="time" value={editRow.isha.adhan} onChange={e => handleEditChange('isha', 'adhan', e.target.value)} className="form-control form-control-sm mb-1" style={{ width: 110, display: 'inline-block' }} />
                          <br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          <input type="time" value={editRow.isha.iqamah} onChange={e => handleEditChange('isha', 'iqamah', e.target.value)} className="form-control form-control-sm" style={{ width: 110, display: 'inline-block' }} />
                        </>
                      ) : (
                        <>
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>ADHAN</span><br />
                          {row.isha.adhan}<br />
                          <span className="text-warning" style={{ fontSize: '0.95rem' }}>IQAMAH</span><br />
                          {row.isha.iqamah}
                        </>
                      )}
                    </td>
                    {/* ACTION */}
                    <td>
                      {editIdx === idx ? (
                        <>
                          <button className="btn btn-success btn-sm px-3 me-2" onClick={() => handleSave(idx)} type="button">Save</button>
                          <button className="btn btn-secondary btn-sm px-2" onClick={handleCancel} type="button">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-info btn-sm text-white px-3" onClick={() => handleEdit(idx)} type="button">Edit</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Other tabs can be implemented as needed */}
    </div>
  );
};

export default SalahTiming; 