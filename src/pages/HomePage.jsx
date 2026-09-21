import { newsArticles, categories } from "../data/news";
import NewsList from "../components/NewsList";
import Sidebar from "../components/Sidebar";
import "../styles/PageLayout.css";

export default function HomePage() {
  return (
    <div className="page-layout">
      <div className="page-layout__main">
        <div className="page-layout__heading">
          <h1 className="page-layout__title">Ultime Notizie</h1>
          <div className="page-layout__accent" />
        </div>
        <NewsList articles={newsArticles} />
      </div>
      <aside className="page-layout__sidebar">
        <Sidebar categories={categories} />
      </aside>
    </div>
  );
}
