import React from 'react';
import './PrayerTimes.css';
import tombImg from '../images/tomb.jpeg';

const prayers = [
  { name: 'Jumah', time: '5:00 PM', azan: '4:30 PM' },
  { name: 'Chouruk', time: '5:00 PM', azan: '4:30 PM' },
  { name: 'Fajr', time: '5:00 PM', azan: '4:30 PM' },
  { name: 'Zuhr', time: '5:00 PM', azan: '4:30 PM' },
  { name: 'Asr', time: '5:00 PM', azan: '4:30 PM' },
  { name: 'Mugrib', time: '5:00 PM', azan: '4:30 PM' },
  { name: 'Isha', time: '5:00 PM', azan: '4:30 PM' },
];

const PrayerTimes = () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = today.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="prayer-times-section container my-5">
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="fw-bold mb-3">Prayer Times</h2>
        </div>
        <div className="col-md-6 text-md-end">
          <p className="text-muted" style={{maxWidth: '300px', marginLeft: '120px', textAlign: 'justify'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet dolor mauris suscipit felis pellentesque et, dolor tristique ipsum.
          </p>
        </div>
      </div>
      <div className="prayer-times-card beautiful-layout mx-auto mt-3">
        <img src={tombImg} alt="Tomb" className="prayer-bg-img" />
        <div className="prayer-times-overlay">
          {/* Top row: Jumah (left), Chouruk (right) */}
          <div className="d-flex justify-content-between align-items-start mb-5 prayer-top-row-beautiful">
            <div className="prayer-card-col">
              <div className="prayer-card">
                <div className="prayer-name">{prayers[0].name}</div>
                <div className="prayer-time">{prayers[0].time}</div>
                <div className="prayer-azan">Azan: {prayers[0].azan}</div>
              </div>
            </div>
            <div className="prayer-card-col">
              <div className="prayer-card">
                <div className="prayer-name">{prayers[1].name}</div>
                <div className="prayer-time">{prayers[1].time}</div>
                <div className="prayer-azan">Azan: {prayers[1].azan}</div>
              </div>
            </div>
          </div>
          {/* Center clock and masjid name (absolutely centered) */}
          <div className="prayer-center-content-beautiful text-center">
            <div className="prayer-center-title mb-2">Vaxjo Muslimska Samfundet</div>
            <div className="prayer-center-time">{timeStr}</div>
            <div className="prayer-center-date">{dateStr}</div>
          </div>
          {/* Bottom row: Fajr, Zuhr, Asr, Mugrib, Isha */}
          <div className="d-flex justify-content-center gap-3 flex-wrap prayer-bottom-row-beautiful mt-5">
            {prayers.slice(2).map((p) => (
              <div key={p.name} className="prayer-card">
                <div className="prayer-name">{p.name}</div>
                <div className="prayer-time">{p.time}</div>
                <div className="prayer-azan">Azan: {p.azan}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes; 