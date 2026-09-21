import "../styles/NewsDetail.css";

export default function NewsDetail({ article }) {
  if (!article) {
    return <div className="news-detail__notfound">Notizia non trovata</div>;
  }

  return (
    <article className="news-detail">
      <div className="news-detail__header">
        <img
          src={article.image}
          alt={article.title}
          className="news-detail__image"
        />
        <div className="news-detail__overlay">
          <h1 className="news-detail__title">{article.title}</h1>
          <div className="news-detail__meta">
            <span className="news-detail__category">{article.category}</span>
            <time className="news-detail__date">
              {new Date(article.date).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>
      <div className="news-detail__body">
        <p className="news-detail__excerpt">{article.excerpt}</p>
        <div className="news-detail__content">
          {article.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
