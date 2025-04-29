import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import ProtectedRoute from "@/auth/ProtectedRoute";
import ReceivingPage from "@/pages/Receiving";
import WashingPage from "./pages/Washing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/recebimento" element={<ReceivingPage />}/>
          <Route path="/lavagem" element={<WashingPage />}/>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
