// import React from 'react'
// import LandingPage from './components/LandingPage'
// import LoginForm from './components/Login'
// import Appointment from './components/Appointment'
// function App() {
//   return (
//     <div>
//       {/* <LandingPage/>   */}
//       {/* <LoginForm/> */}
//       <Appointment/>
//     </div>
//   )
// }

// export default App

// ✅
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login";
import Appointment from "./components/Appointment";
import LandingPage from "./components/LandingPage";
import "./App.css";

function App() {
  return (
    <Router basename="/BerryDial">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/appointment" element={<Appointment />} />
        </Routes>
      </Router>
  );
}

export default App;
