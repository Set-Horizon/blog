import { Link } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">⏺</span>
          <span className="header__logo-text">SET HORIZON</span>
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__nav-link">Notizie</Link>
          <Link to="/categorie" className="header__nav-link">Categorie</Link>
          <Link to="/about" className="header__nav-link">About</Link>
        </nav>
      </div>
    </header>
  );
}
