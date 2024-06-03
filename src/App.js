import './App.css';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import One from './One';

const App = () => {
  return (
    <Routes>
      <Route path='/one' element={<One />} />
    </Routes>
  );
}

export default App;
