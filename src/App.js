import './App.css';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';

const App = () => {
  return (
    <Routes>
      <Route path='/one' element={<One />} />
      <Route path='/two' element={<Two />} />
      <Route path='/three' element={<Three />} />
      <Route path='/four' element={<Four />} />
      <Route path='/five' element={<Five />} />
    </Routes>
  );
}

export default App;
