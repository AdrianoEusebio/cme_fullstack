import { useForm, SubmitHandler } from "react-hook-form";
import api from "@/services/api";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PopupMessage from "@/components/PopupMessage";
import { jwtDecode } from "jwt-decode";	 
import "./style.css";

interface LoginFormInputs {
  username: string;
  password: string;
}

interface DecodedToken {
  username: string;
  group: string;
  exp: number;
  iat: number;
}

function LoginPage() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [popupType, setPopupType] = useState<"success" | "error" | "alert" | "info">("error");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post<{ access: string }>("/token/", data);
      const token = response.data.access;

      login(token);

      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.username) {
        localStorage.setItem("username", decoded.username);
      }
      if (decoded.group) {
        localStorage.setItem("group", decoded.group);
      }

      setPopupType("success");
      setPopupMessage("Login realizado com sucesso!");
      setShowPopup(true);

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error(error);

      setPopupType("error");
      setPopupMessage("Usuário ou senha inválidos!");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>CME-Bringel</h2>
        <p>Faça login para continuar</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("username")} placeholder="Usuário" className="input-field" />
          <input {...register("password")} type="password" placeholder="Senha" className="input-field" />
          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>

      {showPopup && popupMessage && (
        <PopupMessage
          type={popupType}
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default LoginPage;
