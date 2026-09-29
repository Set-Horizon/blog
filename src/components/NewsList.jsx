import { Link } from "react-router-dom";
import "../styles/NewsList.css";

function sortArticles(articles) {
  return [...articles].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.id - a.id;
  });
}

export default function NewsList({ articles }) {
  return (
    <section className="news-list">
      {sortArticles(articles).map((article) => (
        <article key={article.id} className="news-card">
          <Link to={`/notizie/${article.id}`} className="news-card__link">
            <div className="news-card__image-wrapper">
              <img
                src={article.image}
                alt={article.title}
                className="news-card__image"
              />
              <div className="news-card__category-tag">
                {article.category}
              </div>
            </div>
            <div className="news-card__body">
              <h2 className="news-card__title">{article.title}</h2>
              <p className="news-card__excerpt">{article.excerpt}</p>
              <div className="news-card__meta">
                <time className="news-card__date">
                  {new Date(article.date).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
