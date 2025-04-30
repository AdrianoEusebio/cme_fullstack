import { useEffect, useState } from "react";
import api from "@/services/api";
import DrawerNavigation from "@/components/DrawerNavigation";
import PopupMessage from "@/components/PopupMessage";
import "@/styles/global.css";

interface SerialItem {
  id: number;
  codigo_serial: string;
  produto_nome: string;
}

interface Distribution {
  id: number;
  produto_serial: string;
  codigo_serial: string;
  produto_nome: string;
  sector: string;
  entry_data: string;
}

function DistributionPage() {
  const [seriaisDisponiveis, setSeriaisDisponiveis] = useState<SerialItem[]>([]);
  const [seriaisSelecionados, setSeriaisSelecionados] = useState<number[]>([]);
  const [setor, setSetor] = useState<string>("");
  const [distribuidos, setDistribuidos] = useState<Distribution[]>([]);
  const [popup, setPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchSeriaisDisponiveis();
    fetchDistribuidos();
  }, []);

  const fetchSeriaisDisponiveis = async () => {
    try {
      const response = await api.get("/v1/product-serials/seriais-validos-distribution/");
      setSeriaisDisponiveis(response.data);
    } catch (error) {
      console.error("Erro ao buscar seriais disponíveis:", error);
    }
  };

  const fetchDistribuidos = async () => {
    try {
      const response = await api.get("/v1/distributions/");
      setDistribuidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar distribuições:", error);
    }
  };

  const handleDistribuir = async () => {
    if (!setor) {
      setPopup({ type: "error", message: "Informe o setor." });
      return;
    }
    if (seriaisSelecionados.length === 0) {
      setPopup({ type: "error", message: "Selecione ao menos um serial." });
      return;
    }

    try {
      const selecionados = seriaisDisponiveis.filter((serial) =>
        seriaisSelecionados.includes(serial.id)
      );

      await Promise.all(
        selecionados.map(async (serial) => {
          await api.post("/v1/distributions/", {
            produto_serial: serial.id,
            sector: setor,
          });
        })
      );

      setPopup({ type: "success", message: "Distribuição realizada!" });
      setSeriaisSelecionados([]);
      setSetor("");
      await fetchSeriaisDisponiveis();
      await fetchDistribuidos();
    } catch (error: any) {
      console.error("Erro geral na distribuição:", error.response?.data || error.message);
      setPopup({ type: "error", message: "Erro ao distribuir (ver console)." });
    }
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group")} />
      <main className="content">
        <header className="header">
          <h1 className="title">📦 Distribuição</h1>
        </header>

        <div className="process-grid">
          {/* Tabela Seriais Disponíveis */}
          <section className="process-history">
            <h2>Seriais Disponíveis</h2>
            <input
              type="text"
              placeholder="Setor"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              className="input-field"
            />
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
                  {seriaisDisponiveis.map((serial) => (
                    <tr key={serial.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={seriaisSelecionados.includes(serial.id)}
                          onChange={() => {
                            setSeriaisSelecionados((prev) =>
                              prev.includes(serial.id)
                                ? prev.filter((s) => s !== serial.id)
                                : [...prev, serial.id]
                            );
                          }}
                        />
                      </td>
                      <td>{serial.codigo_serial}</td>
                      <td>{serial.produto_nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="submit-button" onClick={handleDistribuir}>
              📤 Confirmar Distribuição
            </button>
          </section>

          {/* Tabela Distribuições Realizadas */}
          <section className="process-history">
            <h2>Distribuições Realizadas</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Código Serial</th>
                    <th>Produto</th>
                    <th>Setor</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {distribuidos.map((dist) => (
                    <tr key={dist.id}>
                      <td>{dist.codigo_serial}</td>
                      <td>{dist.produto_nome}</td>
                      <td>{dist.sector}</td>
                      <td>{new Date(dist.entry_data).toLocaleString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default DistributionPage;
