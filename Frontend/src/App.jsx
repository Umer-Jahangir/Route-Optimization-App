import React from 'react';
import RouteOptimizer from './pages/route';
import Home from './pages/home.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/router" element={<RouteOptimizer />} />
      </Routes>
    </Router>
  );
}

export default App;
