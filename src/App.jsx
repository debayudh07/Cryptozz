import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cryptodisplay from "./pages/Cryptodisplay";
function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Cryptodisplay />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
