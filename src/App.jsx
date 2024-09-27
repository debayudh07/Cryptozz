import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cryptodisplay from "./pages/Cryptodisplay";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
function App() {

  return (
    <div>
      
    <CopilotKit publicApiKey="ck_pub_e64926d648343785d8dab62d4c920541" >
      <Router>
        <Routes>
          <Route path="/" element={<Cryptodisplay />} />
        </Routes>
      </Router>
    </CopilotKit>
    </div>
  )
}


export default App
