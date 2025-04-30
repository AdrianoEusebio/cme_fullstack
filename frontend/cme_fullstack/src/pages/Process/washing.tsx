import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import DrawerNavigation from "@/components/DrawerNavigation";
import PopupMessage from "@/components/PopupMessage";
import "@/styles/global.css";

interface SerialItem {
  id: number;
  codigo_serial: string;
  produto_nome: string;
  isWashing: boolean;
}

function WashingPage() {
  const [seriaisDisponiveis, setSeriaisDisponiveis] = useState<SerialItem[]>([]);
  const [seriaisSelecionados, setSeriaisSelecionados] = useState<SerialItem[]>([]);
  const [selectedIdsDisponiveis, setSelectedIdsDisponiveis] = useState<number[]>([]);
  const [selectedIdsParaLavar, setSelectedIdsParaLavar] = useState<number[]>([]);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeriais();
    const salvos = localStorage.getItem('seriaisSelecionadosWashing');
    if (salvos) {
      setSeriaisSelecionados(JSON.parse(salvos));
    }
  }, []);

  const fetchSeriais = async () => {
    try {
      const response = await api.get("/v1/product-serials/", {
        params: { status: "RECEIVING" }
      });
      const seriais = response.data.map((item: any) => ({
        ...item,
        isWashing: false,
      }));
      setSeriaisDisponiveis(seriais);
    } catch (error) {
      console.error("Erro ao buscar seriais disponíveis para Washing:", error);
    }
  };

  const adicionarParaLavagem = async () => {
    const selecionados = seriaisDisponiveis.filter(serial => selectedIdsDisponiveis.includes(serial.id));
    if (selecionados.length === 0) {
      alert("Nenhum serial selecionado para adicionar à lavagem.");
      return;
    }

    try {
      await Promise.all(selecionados.map(async (serial) => {
        await api.post("/v1/washings/", {
          produto_serial: serial.codigo_serial,
          isWashed: false,
        });
      }));

      const adicionados = selecionados.map(serial => ({ ...serial, isWashing: false }));
      const novosSelecionados = [...seriaisSelecionados, ...adicionados];
      setSeriaisSelecionados(novosSelecionados);
      localStorage.setItem('seriaisSelecionadosWashing', JSON.stringify(novosSelecionados));

      setSeriaisDisponiveis(prev => prev.filter(serial => !selectedIdsDisponiveis.includes(serial.id)));
      setSelectedIdsDisponiveis([]);
      setPopup({ type: "success", message: "Seriais adicionados para lavagem!" });
    } catch (error: any) {
      console.error("Erro:", error.response?.data || error);
      setPopup({ type: "error", message: "Erro ao adicionar seriais para lavagem." });
    }
  };

  const confirmarLavagem = async () => {
    if (selectedIdsParaLavar.length === 0) {
      alert("Nenhum produto selecionado para confirmar lavagem.");
      return;
    }

    const confirmar = window.confirm("Tem certeza que deseja marcar esses itens como LAVADOS?");
    if (!confirmar) return;

    try {
      await Promise.all(selectedIdsParaLavar.map(async (id) => {
        await api.post("/v1/process-histories/", {
          serial: id,
          etapa: "WASHING COMPLETE",
        });
      }));

      const atualizados = seriaisSelecionados.map(serial =>
        selectedIdsParaLavar.includes(serial.id) ? { ...serial, isWashing: true } : serial
      );
      setSeriaisSelecionados(atualizados);
      localStorage.setItem('seriaisSelecionadosWashing', JSON.stringify(atualizados));

      setSelectedIdsParaLavar([]);
      setPopup({ type: "success", message: "Lavagem registrada com sucesso!" });
    } catch (error: any) {
      console.error("Erro:", error.response?.data || error);
      setPopup({ type: "error", message: "Erro ao registrar lavagem." });
    }
  };

  const handleSelectDisponiveis = (id: number) => {
    setSelectedIdsDisponiveis(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectParaLavar = (id: number) => {
    setSelectedIdsParaLavar(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group") || ""} />
      <main className="content">
        <header className="header">
          <h1 className="title">🧼 Processos de Lavagem</h1>
        </header>

        <div className="process-grid">
          <section className="process-history">
            <h2>Seriais Disponíveis para Lavagem</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    <th>Código Serial</th>
                    <th>Produto</th>
                  </tr>
                </thead>
                <tbody>
                  {seriaisDisponiveis.length > 0 ? (
                    seriaisDisponiveis.map(item => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIdsDisponiveis.includes(item.id)}
                            onChange={() => handleSelectDisponiveis(item.id)}
                          />
                        </td>
                        <td>{item.codigo_serial}</td>
                        <td>{item.produto_nome}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>Nenhum serial disponível.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="submit-button" onClick={adicionarParaLavagem}>
              ➡️ Adicionar à lista de lavagem
            </button>
          </section>

          <section className="process-history">
            <h2>Seriais Selecionados para Lavagem</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    <th>Código Serial</th>
                    <th>Produto</th>
                  </tr>
                </thead>
                <tbody>
                  {seriaisSelecionados.filter(item => !item.isWashing).length > 0 ? (
                    seriaisSelecionados.filter(item => !item.isWashing).map(item => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIdsParaLavar.includes(item.id)}
                            onChange={() => handleSelectParaLavar(item.id)}
                          />
                        </td>
                        <td>{item.codigo_serial}</td>
                        <td>{item.produto_nome}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3}>Nenhum serial aguardando lavagem.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="submit-button" onClick={confirmarLavagem}>
              🧼 Confirmar Lavagem
            </button>
          </section>
        </div>

        {popup && (
          <PopupMessage
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup(null)}
          />
        )}
      </main>
    </div>
  );
}

export default WashingPage;
