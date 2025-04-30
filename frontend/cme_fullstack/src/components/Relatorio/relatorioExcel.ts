import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "@/services/api";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

interface ProcessHistoryItem {
    id: number;
    serialMaterial: string;
    idUser: string;
    enumStatus: string;
    entryData: string;
}

async function buscarTodosProcessos(): Promise<ProcessHistoryItem[]> {
  let resultados: ProcessHistoryItem[] = [];
  let url = "v1/process-histories/";

  while (url) {
    const response = await api.get(url);
    const data = response.data;

    if (Array.isArray(data)) {
      resultados = resultados.concat(data);
      break;
    }

    resultados = resultados.concat(data.results || []);
    url = data.next ? new URL(data.next).pathname + new URL(data.next).search : "";
  }

  return resultados;
}

export const gerarRelatorioExcel = async () => {
  try {
    const dados = await buscarTodosProcessos();
    console.log("Dados brutos recebidos:", dados);
    const dadosFormatados = dados.map((item) => ({
        ID: item.id,
        Serial: item.serialMaterial,
        Etapa: item.enumStatus,
        Usuário: item.idUser,
        Data: dayjs(item.entryData).format("DD/MM/YYYY HH:mm"),
      }));

    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico de Processos");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "relatorio-processos.xlsx");
  } catch (error) {
    console.error("Erro ao gerar Excel:", error);
    alert("Erro ao gerar o arquivo Excel.");
  }
};
