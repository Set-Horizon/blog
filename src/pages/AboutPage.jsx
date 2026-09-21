import "../styles/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="page-layout__heading">
        <h1 className="page-layout__title">About</h1>
        <div className="page-layout__accent" />
      </div>
      <div className="about-page__content">
        <p>
          <strong>SET HORIZON</strong> è un portale d'informazione
          indipendente che copre le ultime notizie da tutto il mondo, con
          categorie che spaziano dalla politica alla tecnologia, dalla scienza
          agli eventi.
        </p>
        <p>
          Nato dall'idea di offrire un'informazione chiara e accessibile, Set
          Horizon si impegna a fornire articoli verificati e aggiornati,
          scritti con passione per chi cerca notizie reali e approfondimenti
          di qualità.
        </p>
        <p>
          Il design del sito è ispirato all'estetica industriale e
          futuristica del mondo dell'informatica, con colori scuri e accenti
          luminosi per un'esperienza di lettura moderna e coinvolgente.
        </p>
        <p>
          Ogni articolo presenta una categoria, un'immagine, un riassunto e
          un contenuto completo. Le notizie sono reali e aggiornate
          periodicamente.
        </p>
      </div>
    </div>
  );
}
