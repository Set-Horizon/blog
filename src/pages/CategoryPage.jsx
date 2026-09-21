import { useParams, Link } from "react-router-dom";
import { newsArticles, categories } from "../data/news";
import NewsList from "../components/NewsList";
import Sidebar from "../components/Sidebar";
import "../styles/PageLayout.css";

export default function CategoryPage() {
  const { catId } = useParams();
  const category = categories.find((c) => c.id === catId);
  const articles = newsArticles.filter(
    (a) => a.category.toLowerCase() === category?.name.toLowerCase()
  );

  if (!category) {
    return (
      <div className="page-layout">
        <div className="page-layout__main">
          <h2>Categoria non trovata</h2>
          <Link to="/categorie">Tutte le categorie</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <div className="page-layout__main">
        <div className="page-layout__heading">
          <h1 className="page-layout__title">{category.name}</h1>
          <div className="page-layout__accent" />
        </div>
        {articles.length === 0 ? (
          <p style={{ color: "#667788", padding: "1rem" }}>
            Nessuna notizia in questa categoria.
          </p>
        ) : (
          <NewsList articles={articles} />
        )}
      </div>
      <aside className="page-layout__sidebar">
        <Sidebar categories={categories} />
      </aside>
    </div>
  );
}
