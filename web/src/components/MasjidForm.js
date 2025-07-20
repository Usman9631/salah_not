import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const countryList = [
  'United Kingdom',
  'United States',
  'Pakistan',
  'India',
  'Saudi Arabia',
  'Turkey',
  'Other',
];

const primaryLangList = [
  'English with Start and Sunrise',
  'English',
  'Urdu',
  'Arabic',
  'Other',
];

const secondaryLangList = [
  'Arabic',
  'Urdu',
  'English',
  'Other',
];

const iconMap = {
  name: 'fa-mosque',
  address: 'fa-map-marker-alt',
  zip: 'fa-mail-bulk',
  city: 'fa-city',
  country: 'fa-flag',
  latitude: 'fa-location-arrow',
  longitude: 'fa-location-arrow',
  primaryLang: 'fa-language',
  secondaryLang: 'fa-language',
  masjidNamePrimary: 'fa-mosque',
  masjidNameSecondary: 'fa-mosque',
  subtitle: 'fa-align-left',
};

const iconColor = { color: '#A7BD32' };

const MasjidForm = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    zip: '',
    city: '',
    country: 'United Kingdom',
    latitude: '',
    longitude: '',
    primaryLang: 'English with Start and Sunrise',
    secondaryLang: 'Arabic',
    masjidNamePrimary: '',
    masjidNameSecondary: '',
    subtitle: '',
    logo: null,
  });
  const [logoHover, setLogoHover] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = e => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, logo: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Save logic here
    alert('Masjid info saved!');
  };

  const inputGroup = (name, label, required = false, type = 'text', disabled = false, extra = {}) => (
    <div className="input-group mb-3">
      <span className="input-group-text bg-white border-end-0" style={{ minWidth: 42, justifyContent: 'center' }}>
        <i className={`fa ${iconMap[name]}`} style={iconColor}></i>
      </span>
      <input
        className={`form-control border-start-0 ${disabled ? 'bg-light' : ''}`}
        name={name}
        value={form[name]}
        onChange={handleChange}
        required={required}
        type={type}
        disabled={disabled}
        placeholder={label + (required ? ' *' : '')}
        {...extra}
      />
    </div>
  );

  return (
    <form
      className="p-3"
      style={{
        background: '#fafdff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(33,150,243,0.09)',
        position: 'sticky',
        top: 70,
        marginTop: 0,
        marginBottom: 0,
        zIndex: 2
      }}
      onSubmit={handleSubmit}
    >
      <h4 className="mb-2 fw-bold text-center" style={{ color: '#0F0F0F' }}>Edit Masjid</h4>
      <div className="row g-2 align-items-center mb-1">
        <div className="col-md-8">
          <div className="mb-1">{inputGroup('name', 'Name', true)}</div>
        </div>
        <div className="col-md-4 d-flex flex-column align-items-center">
          <div
            style={{ width: 150, height: 80, border: logoHover ? '2px solid #2196f3' : '1px solid #ddd', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5faff', marginBottom: 6, transition: 'border 0.2s' }}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
          >
            {form.logo ? (
              <img src={form.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '70px', objectFit: 'contain' }} />
            ) : (
              <span style={{ color: '#888', fontSize: 13 }}>HULL MOSQUE & ISLAMIC CENTRE</span>
            )}
          </div>
          <label className="btn btn-sm btn-info text-white mt-1 shadow-sm" style={{ fontWeight: 500, borderRadius: 8 }}>
            <i className="fa fa-upload me-2"></i>Select logo
            <input type="file" accept="image/*" onChange={handleLogoChange} hidden />
          </label>
        </div>
      </div>
      <div className="row g-2 mb-1">
        <div className="col-md-8">{inputGroup('address', 'Address')}</div>
        <div className="col-md-4">{inputGroup('zip', 'Zip code', true)}</div>
      </div>
      <div className="row g-2 mb-1">
        <div className="col-md-6">{inputGroup('city', 'City', true)}</div>
        <div className="col-md-6">{inputGroup('country', 'Country', true, 'text', true)}</div>
      </div>
      <div className="row g-2 mb-1">
        <div className="col-md-6">{inputGroup('latitude', 'Latitude')}</div>
        <div className="col-md-6">{inputGroup('longitude', 'Longitude')}</div>
      </div>
      <div className="row g-2 mb-1">
        <div className="col-md-6">
          <div className="input-group mb-1">
            <span className="input-group-text bg-white border-end-0" style={{ minWidth: 42, justifyContent: 'center' }}>
              <i className="fa fa-language" style={iconColor}></i>
            </span>
            <select className="form-select border-start-0" name="primaryLang" value={form.primaryLang} onChange={handleChange} required>
              {primaryLangList.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group mb-1">
            <span className="input-group-text bg-white border-end-0" style={{ minWidth: 42, justifyContent: 'center' }}>
              <i className="fa fa-language" style={iconColor}></i>
            </span>
            <select className="form-select border-start-0" name="secondaryLang" value={form.secondaryLang} onChange={handleChange}>
              {secondaryLangList.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="row g-2 mb-1">
        <div className="col-md-6">{inputGroup('masjidNamePrimary', 'Masjid name in primary language', true)}</div>
        <div className="col-md-6">{inputGroup('masjidNameSecondary', 'Masjid name in secondary language')}</div>
      </div>
      <div className="row g-2 mb-1">
        <div className="col-12">{inputGroup('subtitle', 'Sub title')}</div>
      </div>
      <div className="col-12 text-end mt-3">
        <button className="btn btn-info px-5 py-2 text-white shadow-sm" style={{ fontWeight: 600, fontSize: '1.1rem', borderRadius: 8 }} type="submit">
          <i className="fa fa-save me-2"></i>Save
        </button>
      </div>
    </form>
  );
};

export default MasjidForm; 