import React, { useState } from 'react';

const IqamahJumah = ({ onScreenSettingsClick }) => {
  const [tab, setTab] = useState('Iqamah');
  // Jummah state
  const [jummahRows, setJummahRows] = useState([
    { id: 1, adhan: '13:20', minutesToIqamah: 25 }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ adhan: '', minutesToIqamah: '' });

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditData({ adhan: row.adhan, minutesToIqamah: row.minutesToIqamah });
  };
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleSave = (id) => {
    setJummahRows(jummahRows.map(row => row.id === id ? { ...row, ...editData } : row));
    setEditingId(null);
  };
  const handleCancel = () => {
    setEditingId(null);
  };
  const handleDelete = (id) => {
    setJummahRows(jummahRows.filter(row => row.id !== id));
  };
  const handleAdd = () => {
    const newId = jummahRows.length ? Math.max(...jummahRows.map(r => r.id)) + 1 : 1;
    setJummahRows([...jummahRows, { id: newId, adhan: '', minutesToIqamah: '' }]);
    setEditingId(newId);
    setEditData({ adhan: '', minutesToIqamah: '' });
  };

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm" style={{ minHeight: 400 }}>
      <div className="d-flex border-bottom mb-3">
        <button
          className={`btn btn-link px-3 py-2 ${tab === 'Iqamah' ? 'fw-bold text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
          style={{ textDecoration: 'none', fontSize: '1.1rem'}}
          onClick={() => setTab('Iqamah')}
        >
          Iqamah
        </button>
        <button
          className={`btn btn-link px-3 py-2 ${tab === 'Jumah' ? 'fw-bold text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
          style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          onClick={() => setTab('Jumah')}
        >
          Jumah
        </button>
      </div>
      {tab === 'Iqamah' && (
        <div>
          <h4 className="fw-semibold mb-1">Iqamah</h4>
          <div className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Set Iqamah Minutes</div>
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="form-label">Minutes to Fajr Iqamah</label>
              <input className="form-control" type="number" value={0} disabled />
            </div>
            <div className="col-md-4">
              <label className="form-label">Minutes to Dhuhr Iqamah</label>
              <input className="form-control" type="number" value={0} disabled />
            </div>
            <div className="col-md-4">
              <label className="form-label">Minutes to Asr Iqamah</label>
              <input className="form-control" type="number" value={0} disabled />
            </div>
            <div className="col-md-6">
              <label className="form-label">Minutes to Maghrib Iqamah</label>
              <input className="form-control" type="number" value={0} disabled />
            </div>
            <div className="col-md-6">
              <label className="form-label">Minutes to Isha Iqamah</label>
              <input className="form-control" type="number" value={0} disabled />
            </div>
          </div>
          <div className="alert alert-warning mt-3" style={{ fontSize: '1.08rem' }}>
            Fields are disabled because you have enabled "Specify iqamah time for each salah" in the <a href="#" className="text-decoration-underline" onClick={e => { e.preventDefault(); if (onScreenSettingsClick) onScreenSettingsClick(); }}>Screen Settings</a>.
          </div>
        </div>
      )}
      {tab === 'Jumah' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-semibold mb-1">Jumah</h4>
              <div className="text-muted" style={{ fontSize: '1.1rem' }}>Set Jumah time</div>
            </div>
            <button className="btn btn-info d-flex align-items-center" onClick={handleAdd}>
              <span className="me-1"> <i className="fa fa-plus" /> </span> Add
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-borderless mb-0">
              <thead>
                <tr style={{ background: '#f7f9fa' }}>
                  <th>Jumah Adhan</th>
                  <th>Minutes to Jumah Iqamah</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jummahRows.map(row => (
                  <tr key={row.id} style={{ background: '#f7f9fa' }}>
                    <td>
                      {editingId === row.id ? (
                        <input type="time" name="adhan" value={editData.adhan} onChange={handleEditChange} className="form-control" style={{ maxWidth: 120 }} />
                      ) : (
                        row.adhan
                      )}
                    </td>
                    <td>
                      {editingId === row.id ? (
                        <input type="number" name="minutesToIqamah" value={editData.minutesToIqamah} onChange={handleEditChange} className="form-control" style={{ maxWidth: 80 }} />
                      ) : (
                        row.minutesToIqamah
                      )}
                    </td>
                    <td>
                      {editingId === row.id ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(row.id)}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(row)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>Delete</button>
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
    </div>
  );
};

export default IqamahJumah; 