import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Process/home";
import ProtectedRoute from "@/auth/ProtectedRoute";
import ReceivingPage from "@/pages/Process/receiving";
import WashingPage from "./pages/Process/washing";
import DistributionPage from "./pages/Process/distribution";
import EsterelizationPage from "./pages/Process/esterelization";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/recebimento" element={<ReceivingPage />}/>
          <Route path="/lavagem" element={<WashingPage />}/>
          <Route path="/distribuicao" element={<DistributionPage />}/>
          <Route path="/esterelizacao" element={<EsterelizationPage />}/>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
