import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage/HomePage";
import FindRoute from "./pages/findRoute/findRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/find-route" element={<FindRoute/>} />
        {/* <Route path="/bio" element={<BioPage/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
