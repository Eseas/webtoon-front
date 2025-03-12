// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './routes/Signin';
import Home from './routes/Home';
import WebtoonList from './routes/WebtoonList';
import WebtoonDetail from './routes/WebtoonDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/webtoons" element={<WebtoonList />} />
        <Route path="/webtoons/detail" element={<WebtoonDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
