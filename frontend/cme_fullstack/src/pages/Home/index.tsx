import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PopupMessage from "../../components/PopupMessage";
import "./style.css";

interface ProcessHistoryItem {
  idProcess: number;
  serialMaterial: string;
  idUser: string;
  enumStatus: string;
  entryData: string;
}

function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [processHistory, setProcessHistory] = useState<ProcessHistoryItem[]>([]);
  const [selectedSerial, setSelectedSerial] = useState<string>("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info" | "alert">("info");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    fetchProcessHistory();
    window.addEventListener("roleUpdated", checkAdminAccess);

    return () => {
      window.removeEventListener("roleUpdated", checkAdminAccess);
    };
  }, []);

  const checkAdminAccess = () => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "1");
  };

  const fetchProcessHistory = async () => {
    try {
      const response = await api.get<ProcessHistoryItem[]>("/processHistory/");
      setProcessHistory(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico de processos:", error);
      setPopupType("error");
      setPopupMessage("Erro ao buscar histórico de processos.");
      setShowPopup(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const showUserInfo = () => {
    setPopupType("info");
    setPopupMessage("Função de conta ainda não implementada.");
    setShowPopup(true);
  };

  const handleNavigation = (route: string) => {
    navigate(`/${route}`);
  };

  const uniqueSerials = Array.from(new Set(processHistory.map(item => item.serialMaterial)));

  const filteredProcessHistory = () => {
    let history = [...processHistory];
    history.sort((a, b) => b.idProcess - a.idProcess);

    if (selectedSerial) {
      history = history.filter(item => item.serialMaterial === selectedSerial);
    }

    return history;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="home-container">
      <aside className="sidebar">
        <h2>Menu</h2>
        <button onClick={() => handleNavigation("home")}>Histórico</button>
        <button onClick={() => handleNavigation("process")}>Processos</button>
        {isAdmin && (
          <>
            <button onClick={() => handleNavigation("materials")}>Materiais</button>
            <button onClick={() => handleNavigation("users")}>Usuários</button>
          </>
        )}
      </aside>

      <main className="content">
        <header>
          <h1 className="title">CMEBringel - Histórico</h1>
          <div className="header-actions">
            <button className="account-button" onClick={showUserInfo}>👤 Conta</button>
            <button className="logout-button" onClick={handleLogout}>🚪 Sair</button>
          </div>
        </header>

        <section className="process-history">
          <h2>Histórico de Processos</h2>

          <div className="filter-wrapper">
            <label htmlFor="serialFilter">Filtrar por Serial:</label>
            <select id="serialFilter" value={selectedSerial} onChange={(e) => setSelectedSerial(e.target.value)}>
              <option value="">Todos</option>
              {uniqueSerials.map(serial => (
                <option key={serial} value={serial}>{serial}</option>
              ))}
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Material</th>
                  <th>Usuário Responsável</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcessHistory().map(item => (
                  <tr key={item.idProcess}>
                    <td>{item.idProcess}</td>
                    <td>{item.serialMaterial}</td>
                    <td>{item.idUser}</td>
                    <td className="status">{item.enumStatus}</td>
                    <td>{formatDate(item.entryData)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

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

export default HomePage;
