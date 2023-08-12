import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Revieword from "../pages/Revieword"
import BeeLikeCoders from '../pages/BeeLikeCoders';
import Netflixclone from "../pages/Netflixclone"
import TickerBacktest from "../pages/TickerBacktest"
import PrepWhiz from "../pages/PrepWhiz"
import Navbar from './Navbar';
const App = () => {
    return (
        <Routes>
        <Route path="/revieword" element={
            <>
              <Navbar />
              <Revieword />
            </>
          } />
        <Route path="/beelikecoders" element={
            <>
              <Navbar />
              <BeeLikeCoders />
            </>
          } />
        <Route path="/ticker-backtest" element={
            <>
              <Navbar />
              <TickerBacktest />
            </>
          } />
        <Route path="/netflix-clone" element={
            <>
              <Navbar />
              <Netflixclone />
            </>
          } />
        <Route path="/prepwhiz" element={
            <>
              <Navbar />
              <PrepWhiz />
            </>
          } />
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
            </>
          } />

        </Routes>
    );
}

export default App;
