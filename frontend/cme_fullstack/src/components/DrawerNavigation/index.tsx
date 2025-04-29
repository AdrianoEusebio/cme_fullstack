import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

interface DrawerNavigationProps {
  group: string | null;
}

function DrawerNavigation({ group }: DrawerNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => {
    return location.pathname === `/${route}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("group");
    navigate("/login");
  };

  const isAdmin = group === "ADMIN";
  const isTecnico = group === "TECNICO";
  const isEnfermeiro = group === "ENFERMEIRO";

  return (
    <aside className="sidebar">
      <div className="menu-top">
        <h2>Menu</h2>

        <Link to="/home" className={isActive("home") ? "active" : ""}>Histórico</Link>
        {(isAdmin || isTecnico) && (
          <>
            <Link to="/recebimento" className={isActive("recebimento") ? "active" : ""}>Recebimento</Link>
            <Link to="/lavagem" className={isActive("lavagem") ? "active" : ""}>Lavagem</Link>
            <Link to="/distribuicao" className={isActive("distribuicao") ? "active" : ""}>Distribuição</Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link to="/produtos" className={isActive("produtos") ? "active" : ""}>Produtos</Link>
            <Link to="/usuarios" className={isActive("usuarios") ? "active" : ""}>Usuários</Link>
          </>
        )}
        {(isAdmin || isEnfermeiro) && (
          <Link to="/relatorio" className={isActive("relatorio") ? "active" : ""}>Relatório</Link>
        )}
      </div>

      <div className="menu-bottom">
        <button className="account-button">👤 Conta</button>
        <button className="logout-button" onClick={handleLogout}>🚪 Sair</button>
      </div>
    </aside>
  );
}

export default DrawerNavigation;
