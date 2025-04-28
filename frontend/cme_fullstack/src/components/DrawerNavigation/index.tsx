import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.css";

interface DrawerNavigationProps {
  isAdmin: boolean;
}

function DrawerNavigation({ isAdmin }: DrawerNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (route: string) => {
    return location.pathname === `/${route}`;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="menu-top">
        <h2>Menu</h2>
        <Link to="/home" className={isActive("home") ? "active" : ""}>Histórico</Link>
        <Link to="/process" className={isActive("process") ? "active" : ""}>Processos</Link>
        {isAdmin && (
          <>
            <Link to="/materials" className={isActive("materials") ? "active" : ""}>Materiais</Link>
            <Link to="/users" className={isActive("users") ? "active" : ""}>Usuários</Link>
          </>
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
