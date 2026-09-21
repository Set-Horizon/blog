import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import NewsDetailPage from "./pages/NewsDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import GptOssChat from "./components/GptOssChat";
import "./App.css";

export default function App() {
  return (
    <HashRouter>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notizie/:id" element={<NewsDetailPage />} />
          <Route path="/categorie" element={<CategoriesPage />} />
          <Route path="/categorie/:catId" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
      <GptOssChat />
    </HashRouter>
  );
}
