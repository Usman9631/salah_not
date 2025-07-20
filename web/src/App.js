import HeroSection from './components/HeroSection';
import PrayerTimes from './components/PrayerTimes';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <PrayerTimes />
              <Login /> {/* Use capital 'L' for the component */}
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
