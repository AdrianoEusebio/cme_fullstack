import { useEffect, useState } from "react";
import api from "@/services/api";
import DrawerNavigation from "@/components/DrawerNavigation";
import PopupMessage from "@/components/PopupMessage";
import "@/styles/global.css";

interface Product {
  id: number;
  nome: string;
  category: number;
}

interface Category {
  id: number;
  type: string;
}

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ nome: "", category: 0 });
  const [popup, setPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/v1/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/v1/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/v1/products/", form);
      setPopup({ type: "success", message: "Produto criado com sucesso!" });
      setForm({ nome: "", category: 0 });
      fetchProducts();
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setPopup({ type: "error", message: "Erro ao criar produto." });
    }
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group")} />
      <main className="content">
        <header className="header">
          <h1 className="title">📦 Produtos</h1>
        </header>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <section
            className="process-history"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <h2>Criar novo produto</h2>
            <input
              className="input-field"
              type="text"
              placeholder="Nome do produto"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <select
              className="input-field"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: parseInt(e.target.value) })
              }
            >
              <option value={0}>Selecione a categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.type}
                </option>
              ))}
            </select>
            <button className="submit-button" onClick={handleCreate}>
              ➕ Adicionar Produto
            </button>
          </section>
          <section className="process-history" style={{ flex: 2 }}>
            <h2>Lista de produtos</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>ID Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nome}</td>
                      <td>{p.category}</td>
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

export default ProductPage;
