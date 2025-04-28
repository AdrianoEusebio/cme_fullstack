import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
