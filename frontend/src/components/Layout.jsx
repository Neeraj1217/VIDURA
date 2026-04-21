import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/inbox", label: "Inbox" },
  { to: "/priority", label: "Priority" },
  { to: "/reply", label: "Reply Generator" }
];

export const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>VIDURA</h1>
        <p className="sidebar-subtitle">AI Gmail Assistant</p>
        <nav>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} className={isActive ? "nav-link active" : "nav-link"}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};
