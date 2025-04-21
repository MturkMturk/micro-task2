import './App.css';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Main from './Main';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';
import Six from './Six';
import Seven from './Seven';
import Eight from './Eight';
import Nine from './Nine';
import Ten from './Ten';

const App = () => {
  return (
    <Routes>
      <Route path='/main' element={<Main />} />
      <Route path='/one' element={<One />} />
      <Route path='/two' element={<Two />} />
      <Route path='/three' element={<Three />} />
      <Route path='/four' element={<Four />} />
      <Route path='/five' element={<Five />} />
      <Route path='/six' element={<Six />} />
      <Route path='/seven' element={<Seven />} />
      <Route path='/eight' element={<Eight />} />
      <Route path='/nine' element={<Nine />} />
      <Route path='/ten' element={<Ten />} />
    </Routes>
  );
}

export default App;
