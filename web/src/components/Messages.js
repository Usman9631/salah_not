import React, { useState, useRef } from 'react';

const initialMessages = [
  { id: 1, title: 'Eid prayer times', language: 'English with Start and Subtitles', type: 'Image', duration: 60, expiry: '2025-09-03', event: true, eventStart: '2025-06-06', eventEnd: '2025-06-06', image: '', active: true, reach: 294 },
  { id: 2, title: '2A', language: 'English', type: 'Image', duration: 60, expiry: '2025-04-21', event: false, eventStart: '', eventEnd: '', image: '', active: false, reach: 143 },
  { id: 3, title: '1A', language: 'English', type: 'Image', duration: 60, expiry: '2025-04-21', event: false, eventStart: '', eventEnd: '', image: '', active: false, reach: 143 },
  { id: 4, title: '1', language: 'English', type: 'Image', duration: 60, expiry: '2025-04-21', event: false, eventStart: '', eventEnd: '', image: '', active: false, reach: 143 },
];

const typeOptions = ['Image', 'Text', 'Video'];
const languageOptions = ['English', 'English with Start and Subtitles', 'Arabic', 'Urdu'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const Messages = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('add'); // 'add' or 'edit'
  const [form, setForm] = useState({ id: '', title: '', language: languageOptions[0], type: 'Image', duration: 60, expiry: '', event: false, eventStart: '', eventEnd: '', image: '', active: true, reach: 0 });
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef();

  const openAdd = () => {
    setFormType('add');
    setForm({ id: '', title: '', language: languageOptions[0], type: 'Image', duration: 60, expiry: '', event: false, eventStart: '', eventEnd: '', image: '', active: true, reach: 0 });
    setShowForm(true);
  };
  const openEdit = (msg) => {
    setFormType('edit');
    setForm({ ...msg });
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setForm(f => ({ ...f, image: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = e => {
    e.preventDefault();
    if (formType === 'add') {
      const newId = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1;
      setMessages([...messages, { ...form, id: newId, reach: Math.floor(Math.random() * 300) }]);
    } else {
      setMessages(messages.map(m => m.id === form.id ? { ...form } : m));
    }
    setShowForm(false);
  };

  const confirmDelete = id => setDeleteId(id);
  const handleDelete = () => {
    setMessages(messages.filter(m => m.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm" style={{ minHeight: 400 }}>
      {!showForm && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-semibold text-primary mb-0" style={{ letterSpacing: 1 }}>ALL MESSAGES</h3>
            <button className="btn btn-info text-white px-4 py-2 fw-semibold" style={{ fontSize: '1.15rem' }} onClick={openAdd}>Add message</button>
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr style={{ background: '#f7f9fa' }}>
                  <th>ID</th>
                  <th>TITLE</th>
                  <th>ACTIVE</th>
                  <th>TYPE</th>
                  <th>EXPIRY DATE</th>
                  <th>REACH</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, idx) => (
                  <tr key={msg.id} style={{ background: idx % 2 === 0 ? '#f7f9fa' : 'white' }}>
                    <td>{msg.id}</td>
                    <td>{msg.title}</td>
                    <td>
                      {msg.active ? (
                        <span><span style={{ height: 12, width: 12, background: '#3bb662', borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>Active</span>
                      ) : (
                        <span><span style={{ height: 12, width: 12, background: '#ff7b7b', borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>Inactive</span>
                      )}
                    </td>
                    <td>{msg.type}</td>
                    <td><i className="fa fa-clock-o me-1" />{formatDate(msg.expiry)}</td>
                    <td>{msg.reach}</td>
                    <td>
                      <button className="btn btn-info btn-sm me-2" style={{ minWidth: 50 }} onClick={() => openEdit(msg)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ minWidth: 60 }} onClick={() => confirmDelete(msg.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end align-items-center mt-3">
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled"><button className="page-link">Previous</button></li>
                <li className="page-item active"><button className="page-link">1</button></li>
                <li className="page-item disabled"><button className="page-link">Next</button></li>
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Add/Edit Full Form Overlay */}
      {showForm && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(250,252,255,0.97)', zIndex: 1000, left: 0, minHeight: '100vh', padding: 0, overflow: 'auto' }}>
          <form className="p-4 rounded-4 shadow-sm bg-white position-relative d-flex flex-column" style={{ maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', margin: '40px auto', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)' }} onSubmit={handleSave}>
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ position: 'sticky', top: 0, background: 'white', zIndex: 2, paddingBottom: 8 }}>
              <h3 className="fw-semibold mb-0">{formType === 'add' ? 'Add message' : 'Edit message'}</h3>
              <button type="button" className="btn-close" onClick={closeForm}></button>
            </div>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Title</label>
                <input className="form-control" name="title" value={form.title} onChange={handleFormChange} required />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Select language</label>
                <select className="form-select" name="language" value={form.language} onChange={handleFormChange}>
                  {languageOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Select type</label>
                <select className="form-select" name="type" value={form.type} onChange={handleFormChange}>
                  {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold">Message duration (sec)</label>
                <input className="form-control" type="number" name="duration" value={form.duration} onChange={handleFormChange} min={1} required />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label fw-semibold">Expiry Date</label>
                <input className="form-control" type="date" name="expiry" value={form.expiry} onChange={handleFormChange} required />
              </div>
              <div className="col-12 d-flex align-items-center mt-2">
                <input type="checkbox" className="form-check-input me-2" id="eventCheck" name="event" checked={form.event} onChange={handleFormChange} />
                <label htmlFor="eventCheck" className="form-label mb-0 fw-semibold">Add Event Date</label>
              </div>
              {form.event && (
                <>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Event Start Date</label>
                    <input className="form-control" type="date" name="eventStart" value={form.eventStart} onChange={handleFormChange} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Event End Date</label>
                    <input className="form-control" type="date" name="eventEnd" value={form.eventEnd} onChange={handleFormChange} />
                  </div>
                </>
              )}
              <div className="col-12 mt-2">
                <label className="form-label fw-semibold">Image</label>
                <div className="border rounded-3 p-2 mb-2 bg-light d-flex align-items-center justify-content-center position-relative" style={{ minHeight: 180, minWidth: 180, maxWidth: 350, maxHeight: 250 }}>
                  {form.image ? (
                    <>
                      <img src={form.image} alt="preview" style={{ maxWidth: 180, maxHeight: 220, borderRadius: 8, background: '#f7f9fa', objectFit: 'contain' }} />
                      <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 px-2 py-0" style={{ borderRadius: '50%', fontSize: 18, lineHeight: 1 }} onClick={() => setForm(f => ({ ...f, image: '' }))} title="Remove image">&times;</button>
                    </>
                  ) : (
                    <span className="text-muted">No image selected</span>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
                <button type="button" className="btn btn-info text-white mt-1" onClick={() => fileInputRef.current.click()}>Select Image</button>
              </div>
              <div className="col-12 d-flex align-items-center mt-2">
                <input type="checkbox" className="form-check-input me-2" id="activeCheck" name="active" checked={form.active} onChange={handleFormChange} />
                <label htmlFor="activeCheck" className="form-label mb-0 fw-semibold">Enable message</label>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4" style={{ position: 'sticky', right: 0, bottom: 0, background: 'white', zIndex: 2 }}>
              <button type="submit" className="btn btn-info text-white px-5 py-2 fw-semibold" style={{ fontSize: '1.15rem' }}>Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Message</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this message?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages; 