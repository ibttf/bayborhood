import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from '../pages/Home';
import Navbar from './Navbar';
const App = () => {
    return (
        <Routes>
          <Route path="*" element={
            <>
              {/* <Navbar /> */}
              <Home />
            </>
          } />

        </Routes>
    );
}

export default App;
