// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './routes/Signin';
import Home from './routes/Home';
import WebtoonList from './routes/WebtoonList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/webtoons" element={<WebtoonList />} />
      </Routes>
    </Router>
  );
}

export default App;
