import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar({ categories }) {
  return (
    <aside className="sidebar">
      <h3 className="sidebar__title">Categorie</h3>
      <ul className="sidebar__list">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              to={`/categorie/${cat.id}`}
              className="sidebar__link"
              style={{ "--cat-color": cat.color }}
            >
              <span className="sidebar__indicator" />
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
