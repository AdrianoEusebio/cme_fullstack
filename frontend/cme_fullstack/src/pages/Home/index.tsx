import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import DrawerNavigation from "@/components/DrawerNavigation";
import "./style.css";

interface ProcessHistoryItem {
  id: number;
  serialMaterial: string;
  idUser: string;
  enumStatus: string;
  entryData: string;
}

function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [processHistory, setProcessHistory] = useState<ProcessHistoryItem[]>(
    []
  );
  const [selectedSerial, setSelectedSerial] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const group = localStorage.getItem("group");
    setIsAdmin(group === "Admin");
    fetchProcessHistory();
  }, []);

  const fetchProcessHistory = async () => {
    try {
      const response = await api.get<ProcessHistoryItem[]>(
        "/v1/process-histories/"
      );
      setProcessHistory(response.data);
    } catch (error) {
      console.error("Erro ao buscar histórico de processos:", error);
    }
  };

  const filteredHistory = processHistory
    .sort((a, b) => b.id - a.id)
    .filter((item) =>
      selectedSerial ? item.serialMaterial === selectedSerial : true
    );

  const uniqueSerials = Array.from(
    new Set(processHistory.map((item) => item.serialMaterial))
  );

  const formatDate = (date: string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group")} />
      <main className="content">
        <header className="header">
          <h1 className="title">📜 Histórico de Processos</h1>
        </header>

        <section className="process-history">
          <div className="filter-wrapper">
            <label htmlFor="serialFilter">Filtrar por Serial:</label>
            <select
              id="serialFilter"
              value={selectedSerial}
              onChange={(e) => setSelectedSerial(e.target.value)}
            >
              <option value="">Todos</option>
              {uniqueSerials.map((serial) => (
                <option key={serial} value={serial}>
                  {serial}
                </option>
              ))}
            </select>
          </div>

          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Material</th>
                  <th>Usuário</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
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
    </div>
  );
}

export default HomePage;
