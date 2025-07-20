import React, { useState, useEffect } from 'react';

const settingsList = [
  { key: 'daylight', label: 'Observe day light saving time' },
  { key: 'showJumah', label: 'Show Jumah time' },
  { key: 'jumahEqualsZuhr', label: 'Make Jumah time equal to Friday Zuhr time' },
  { key: 'showTomorrowIqamah', label: 'Show tomorrow times as Iqamah time and not Adhan time' },
  { key: 'specifyIqamah', label: 'Specify Iqamah for each salah', sub: '(Iqamah can be set for each salah in salah Timings tab)', bold: true },
  { key: 'showIqamahMinutes', label: 'Show Iqamah minutes as time' },
  { key: 'twelveHour', label: 'Display time in 12 hours format' },
  { key: 'showMarkers', label: 'Display salah markers' },
  { key: 'showHijri', label: 'Show Hijri date' },
  { key: 'playSound', label: 'Play turn off mobile sound before Adhan and Iqamah' },
  { key: 'multipleTimings', label: 'Enable multiple salah timings' },
  { key: 'enableArc', label: 'Enable arc for Adhan and Iqamah' },
];

const defaultState = {
  daylight: false,
  showJumah: true,
  jumahEqualsZuhr: false,
  showTomorrowIqamah: true,
  specifyIqamah: true,
  showIqamahMinutes: false,
  twelveHour: true,
  showMarkers: false,
  showHijri: true,
  playSound: false,
  multipleTimings: false,
  enableArc: true,
};

const hijriOptions = [
  { value: 0, label: 'Dont add offset' },
  { value: 1, label: 'Add 1 day to hijri date' },
  { value: 2, label: 'Add 2 days to hijri date' },
  { value: -1, label: 'Minus 1 day from hijri date' },
  { value: -2, label: 'Minus 2 days from hijri date' },
];

const ScreenSettings = () => {
  const [tab, setTab] = useState('Screen Settings');
  const [settings, setSettings] = useState(defaultState);
  const [saveMsg, setSaveMsg] = useState('');
  const [hijriOffset, setHijriOffset] = useState(0);
  const [hijriMsg, setHijriMsg] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('screenSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    const hijri = localStorage.getItem('hijriOffset');
    if (hijri) setHijriOffset(Number(hijri));
  }, []);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  // Placeholder for future API integration
  const saveSettings = async (settingsToSave) => {
    // TODO: Replace with API call
    // await api.saveSettings(settingsToSave);
    // Save to localStorage
    localStorage.setItem('screenSettings', JSON.stringify(settingsToSave));
    return true;
  };

  const handleSave = async () => {
    await saveSettings(settings);
    setSaveMsg('Settings saved!');
    setTimeout(() => setSaveMsg(''), 2500);
  };

  const handleHijriChange = (e) => {
    const val = Number(e.target.value);
    setHijriOffset(val);
    localStorage.setItem('hijriOffset', val);
    setHijriMsg('Hijri offset saved!');
    setTimeout(() => setHijriMsg(''), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-4 shadow-sm" style={{ minHeight: 500 }}>
      <div className="d-flex border-bottom mb-4">
        <button
          className={`btn btn-link px-3 py-2 ${tab === 'Screen Settings' ? 'fw-bold text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
          style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          onClick={() => setTab('Screen Settings')}
        >
          Screen Settings
        </button>
        <button
          className={`btn btn-link px-3 py-2 ${tab === 'Hijri Date' ? 'fw-bold text-primary border-bottom border-2 border-primary' : 'text-secondary'}`}
          style={{ textDecoration: 'none', fontSize: '1.1rem' }}
          onClick={() => setTab('Hijri Date')}
        >
          Hijri Date
        </button>
      </div>
      {tab === 'Screen Settings' && (
        <div className="position-relative" style={{ minHeight: 400 }}>
          <div>
            <h4 className="fw-semibold mb-1">Screen Settings</h4>
            <div className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Set your screen settings</div>
            {saveMsg && (
              <div className="alert alert-success py-2 px-3" style={{ fontSize: '1.05rem', maxWidth: 300 }}>
                {saveMsg}
              </div>
            )}
            <div className="row">
              <div className="col-md-8 col-lg-6">
                {settingsList.map((item, idx) => (
                  <div className="d-flex align-items-center mb-3" key={item.key}>
                    <div className="form-check form-switch me-3" style={{ minWidth: 60 }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={item.key}
                        checked={settings[item.key]}
                        onChange={() => handleToggle(item.key)}
                      />
                    </div>
                    <label htmlFor={item.key} className="form-label mb-0" style={{ fontSize: '1.08rem', fontWeight: item.bold ? 600 : 400 }}>
                      {item.label}
                      {item.sub && (
                        <span className="ms-1 text-secondary" style={{ fontWeight: 500, fontSize: '1.01rem' }}>
                          <span style={{ fontWeight: 600, color: '#3b5b7e' }}>{item.sub}</span>
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="btn btn-info position-absolute" style={{ right: 0, bottom: 0, minWidth: 80 }} onClick={handleSave}>
            Save
          </button>
        </div>
      )}
      {tab === 'Hijri Date' && (
        <div style={{ minHeight: 300 }}>
          <h4 className="fw-semibold mb-1">Hijri Date</h4>
          <div className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Set Hijri calender offset</div>
          {hijriMsg && (
            <div className="alert alert-success py-2 px-3" style={{ fontSize: '1.05rem', maxWidth: 300 }}>
              {hijriMsg}
            </div>
          )}
          <div className="mt-2" style={{ maxWidth: 900 }}>
            <select
              className="form-select form-select-lg"
              value={hijriOffset}
              onChange={handleHijriChange}
              style={{ maxWidth: 1000, minWidth: 400, fontSize: '1.1rem' }}
            >
              {hijriOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenSettings; 