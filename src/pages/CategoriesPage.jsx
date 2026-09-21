import { Link } from "react-router-dom";
import { categories } from "../data/news";
import "../styles/CategoriesPage.css";

export default function CategoriesPage() {
  return (
    <div className="categories-page">
      <div className="page-layout__heading">
        <h1 className="page-layout__title">Categorie</h1>
        <div className="page-layout__accent" />
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categorie/${cat.id}`}
            className="category-card"
            style={{ "--cat-color": cat.color }}
          >
            <span className="category-card__indicator" />
            <span className="category-card__name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
