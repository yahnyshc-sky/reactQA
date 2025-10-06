import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,  Routes, Route } from 'react-router';

import Home from './pages/Home';
import AddPage from './pages/AddPage/AddPage';
import EditPage from './pages/EditPage/EditPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='app-container'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/edit/:id" element={<EditPage />} />
      </Routes>
    </BrowserRouter>
  </div>
  </React.StrictMode>
);
