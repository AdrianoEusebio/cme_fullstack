import { useEffect, useState } from "react";
import api from "@/services/api";
import DrawerNavigation from "@/components/DrawerNavigation";
import PopupMessage from "@/components/PopupMessage";
import "@/styles/global.css";

interface UserItem {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

function UserPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    group: "",
  });

  const [popup, setPopup] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/v1/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/v1/users/", form);
      setPopup({ type: "success", message: "Usuário criado com sucesso!" });
      setForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        group: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setPopup({ type: "error", message: "Erro ao criar usuário." });
    }
  };

  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const response = await api.get("/v1/groups/");
    const nomes = response.data.map((g: any) => g.name);
    setGroups(nomes);
  };

  return (
    <div className="home-container">
      <DrawerNavigation group={localStorage.getItem("group")} />
      <main className="content">
        <header className="header">
          <h1 className="title">👤 Usuários</h1>
        </header>

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <section
            className="process-history"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              gap: "0.75rem",
              paddingBottom: "2rem",
              minHeight: "min-content",
              height: "auto",
              overflow: "visible",
            }}
          >
            <h2>Criar novo usuário</h2>

            <input
              className="input-field"
              type="text"
              placeholder="Usuário"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Nome"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Sobrenome"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
            <input
              className="input-field"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="input-field"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
            >
              <option value="">Selecione o grupo</option>
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <div style={{ marginTop: "auto" }}>
              <button className="submit-button" onClick={handleCreate}>
                ➕ Adicionar Usuário
              </button>
            </div>
          </section>

          <section className="process-history" style={{ flex: 2 }}>
            <h2>Lista de usuários</h2>
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.is_active ? "Sim" : "Não"}</td>
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

export default UserPage;
