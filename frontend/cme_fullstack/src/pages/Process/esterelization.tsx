import { useEffect, useState } from "react";
import api from "@/services/api";
import DrawerNavigation from "@/components/DrawerNavigation";
import PopupMessage from "@/components/PopupMessage";
import ConfirmPopup from "@/components/ConfirmPopup/ConfirmPopup";
import "@/styles/global.css";

interface SerialItem {
  id: number;
  codigo_serial: string;
  produto_nome: string;
}

interface EsterelizationItem {
  id: number;
  produto_serial: string;
  produto_serial_id: number;
  codigo_serial: string;
  produto_nome: string;
  entry_data: string;
  isEsterelization: boolean;
}

function EsterelizationPage() {
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [seriaisAptos, setSeriaisAptos] = useState<SerialItem[]>([]);
  const [emAndamento, setEmAndamento] = useState<EsterelizationItem[]>([]);
  const [selecionadosParaRegistrar, setSelecionadosParaRegistrar] = useState<number[]>([]);
  const [selecionadosConfirmacao, setSelecionadosConfirmacao] = useState<number[]>([]);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchSeriais();
    fetchEmAndamento();
  }, []);

  const fetchSeriais = async () => {
    try {
      const response = await api.get("/v1/product-serials/", {
        params: { status: "WASHING COMPLETE,RECEIVING" },
      });
      setSeriaisAptos(response.data);
    } catch (error) {
      console.error("Erro ao buscar seriais:", error);
    }
  };

  const fetchEmAndamento = async () => {
    try {
      const response = await api.get("/v1/esterelizations/?isEsterelization=false");
      setEmAndamento(response.data);
    } catch (error) {
      console.error("Erro ao buscar em andamento:", error);
    }
  };

  const handleRegistrar = async () => {
    if (selecionadosParaRegistrar.length === 0) {
      setPopup({ type: "error", message: "Selecione ao menos um item para registrar." });
      return;
    }
    try {
      await Promise.all(
        selecionadosParaRegistrar.map((id) => {
          const serial = seriaisAptos.find((s) => s.id === id);
          return api.post("/v1/esterelizations/", {
            produto_serial: serial?.codigo_serial,
            isEsterelization: false,
          });
        })
      );
      setPopup({ type: "success", message: "Esterelização registrada." });
      setSelecionadosParaRegistrar([]);
      fetchSeriais();
      fetchEmAndamento();
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setPopup({ type: "error", message: "Erro ao registrar esterelização." });
    }
  };

  const handleConfirmar = () => {
    if (selecionadosConfirmacao.length === 0) {
      setPopup({ type: "error", message: "Selecione os seriais para confirmar." });
      return;
    }
    setMostrarConfirmacao(true);
  };

  const executarConfirmacao = async () => {
    setMostrarConfirmacao(false);
    try {
      await Promise.all(
        selecionadosConfirmacao.map(async (id) => {
          const encontrado = emAndamento.find(item => item.produto_serial_id === id);
          if (!encontrado) return;

          await api.post("/v1/process-histories/", {
            serial: encontrado.produto_serial_id,
            etapa: "ESTERELIZATION COMPLETE",
          });

          await api.patch(`/v1/esterelizations/${encontrado.id}/`, {
            isEsterelization: true,
          });
        })
      );
      setPopup({ type: "success", message: "Esterelização confirmada." });
      setSelecionadosConfirmacao([]);
      fetchEmAndamento();
    } catch (error) {
      console.error("Erro ao confirmar:", error);
      setPopup({ type: "error", message: "Erro ao confirmar esterelização." });
    }
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group")} />
      <main className="content">
        <header className="header">
          <h1 className="title">🧪 Esterelização</h1>
        </header>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <section className="process-history" style={{ flex: 1 }}>
            <h2>Washing Completo</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    <th>Serial</th>
                    <th>Produto</th>
                  </tr>
                </thead>
                <tbody>
                  {seriaisAptos.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selecionadosParaRegistrar.includes(s.id)}
                          onChange={() =>
                            setSelecionadosParaRegistrar((prev) =>
                              prev.includes(s.id) ? prev.filter(p => p !== s.id) : [...prev, s.id]
                            )
                          }
                        />
                      </td>
                      <td>{s.codigo_serial}</td>
                      <td>{s.produto_nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="submit-button" onClick={handleRegistrar}>
              ➕ Registrar
            </button>
          </section>

          <section className="process-history" style={{ flex: 1 }}>
            <h2>Esterelizações em Andamento</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    <th>Serial</th>
                    <th>Produto</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {emAndamento.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selecionadosConfirmacao.includes(s.produto_serial_id)}
                          onChange={() =>
                            setSelecionadosConfirmacao((prev) =>
                              prev.includes(s.produto_serial_id)
                                ? prev.filter((p) => p !== s.produto_serial_id)
                                : [...prev, s.produto_serial_id]
                            )
                          }
                        />
                      </td>
                      <td>{s.codigo_serial}</td>
                      <td>{s.produto_nome}</td>
                      <td>{new Date(s.entry_data).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="submit-button" onClick={handleConfirmar}>
              ✅ Confirmar Esterelização
            </button>
          </section>
        </div>

        {mostrarConfirmacao && (
          <ConfirmPopup
            message="A esterelização foi concluída com sucesso?"
            onConfirm={executarConfirmacao}
            onCancel={() => setMostrarConfirmacao(false)}
          />
        )}

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

export default EsterelizationPage;