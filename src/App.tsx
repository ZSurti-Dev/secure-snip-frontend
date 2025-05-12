import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import CreateSnippet from './pages/CreateSnippet';
import ViewSnippet from './pages/ViewSnippet';
import Navbar from './components/Navbar';
import QrDetails from './pages/QrDetails';
import Help from './pages/Help'

const NavbarWrapper = () => {
  const location = useLocation();

  return location.pathname !== '/' ? <Navbar /> : null;
};

const App: React.FC = () => {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/snippets" element={<Home />} />
        <Route path="/create" element={<CreateSnippet />} />
        <Route path="/view" element={<ViewSnippet />} />
        <Route path="/help" element={<Help />} />
        <Route path="/qr-details" element={<QrDetails />} />
      </Routes>
    </Router>
  );
};

export default App;