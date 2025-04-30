import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

interface ProcessHistoryItem {
  id: number;
  produto_serial: string;
  etapa: string;
  user: string;
  entry_data: string;
}

export const gerarRelatorioPDF = async () => {
  try {
    const response = await axios.get("/app/v1/process-histories/");
    const data = response.data;
    let dados: ProcessHistoryItem[] = [];

    if (Array.isArray(data)) {
      dados = data;
    } else if (Array.isArray(data.results)) {
      dados = data.results;
    } else {
      console.error("Resposta inesperada da API:", data);
      throw new Error("Formato inesperado da resposta da API.");
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Relatório de Histórico de Processos", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Serial", "Etapa", "Usuário", "Data"]],
      body: dados.map((item: ProcessHistoryItem) => [
        item.id.toString(),
        item.produto_serial,
        item.etapa,
        item.user,
        new Date(item.entry_data).toLocaleString("pt-BR"),
      ]),
    });

    doc.save("relatorio-processos.pdf");
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error);
    if (axios.isAxiosError(error)) {
      console.error("Resposta da API:", error.response?.data || error.message);
    }
    alert("Erro ao gerar o relatório. Verifique a conexão com o servidor ou o formato da resposta.");
  }
};
