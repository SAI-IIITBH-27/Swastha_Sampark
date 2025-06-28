import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/HomePage";
import FindRoute from "./pages/findRoute/findRoute";
import BioPage from "./pages/bioPage/bio";
import PricingPage from "./pages/pricing/pricing";
import Register from "./pages/register/register";
import FindDoctor from "./pages/findDoctor/findDoctor";
import EmergencyReferral from "./pages/ReferalDashboard/referalDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/find-route" element={<FindRoute/>} />
        <Route path="/bio" element={<BioPage/>} />
        <Route path="/pricing" element={<PricingPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/find-doctor" element={<FindDoctor/>} />
        <Route path="/emergencyreferal" element={<EmergencyReferral/>} />
      </Routes>
    </Router>
  );
}

export default App;
