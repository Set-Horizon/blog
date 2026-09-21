import { useParams, Link } from "react-router-dom";
import { newsArticles, categories } from "../data/news";
import NewsDetail from "../components/NewsDetail";
import Sidebar from "../components/Sidebar";
import "../styles/PageLayout.css";

export default function NewsDetailPage() {
  const { id } = useParams();
  const article = newsArticles.find((a) => a.id === Number(id));

  return (
    <div className="page-layout">
      <div className="page-layout__main">
        {article ? (
          <NewsDetail article={article} />
        ) : (
          <div className="page-layout__notfound">
            <h2>Notizia non trovata</h2>
            <Link to="/">Torna alle notizie</Link>
          </div>
        )}
      </div>
      <aside className="page-layout__sidebar">
        <Sidebar categories={categories} />
      </aside>
    </div>
  );
}
