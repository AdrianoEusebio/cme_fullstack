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
}

function ReceivingPage() {
  const [seriaisDisponiveis, setSeriaisDisponiveis] = useState<SerialItem[]>(
    []
  );
  const [selectedSerialCodigo, setSelectedSerialCodigo] = useState<
    string | null
  >(null);
  const [popup, setPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeriais();
  }, []);

  const fetchSeriais = async () => {
    try {
      const response = await api.get<SerialItem[]>("/v1/product-serials/", {
        params: { status: "NO PROCESS,DISTRIBUTION" }
      });
      setSeriaisDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar seriais disponíveis:", error);
    }
  };

  const cadastrarProcesso = async () => {
    if (!selectedSerialCodigo) return;

    try {
      await api.post("/v1/receivings/", {
        produto_serial: selectedSerialCodigo,
      });
      setPopup({
        type: "success",
        message: "Processo de Receiving cadastrado!",
      });
      setSelectedSerialCodigo(null);
      fetchSeriais();
    } catch (error) {
      console.error("Erro ao cadastrar processo:", error);
      setPopup({ type: "error", message: "Erro ao cadastrar processo." });
    }
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group")} />
      <main className="content">
        <header className="header">
          <h1 className="title">📥 Processos de Receiving</h1>
        </header>

        <div className="process-actions">
          <button
            className="submit-button"
            onClick={cadastrarProcesso}
            disabled={!selectedSerialCodigo}
          >
            ➕ Adicionar Processo
          </button>
        </div>

        <section className="process-history">
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
                  seriaisDisponiveis.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="radio"
                          name="serial"
                          value={item.codigo_serial}
                          checked={selectedSerialCodigo === item.codigo_serial}
                          onChange={() =>
                            setSelectedSerialCodigo(item.codigo_serial)
                          }
                        />
                      </td>
                      <td>{item.codigo_serial}</td>
                      <td>{item.produto_nome}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Nenhum serial disponível para Receiving</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

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

export default ReceivingPage;
