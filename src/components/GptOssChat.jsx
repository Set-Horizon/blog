import { useState, useEffect, useRef } from "react";
import "../styles/GptOssChat.css";

export default function GptOssChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [panelHidden, setPanelHidden] = useState(false);
  const lastScrollY = useRef(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setPanelHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setPanelHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll in fondo quando arriva una nuova risposta
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const askGptOss = async () => {
    if (!prompt.trim()) return;
    const userMessage = prompt;
    setPrompt("");
    setLoading(true);
    setError("");

    // Aggiungi messaggio utente alla cronologia
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const res = await fetch("https://dg-ai.scriptsnsenses.workers.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ----------"
        },
        body: JSON.stringify({
          model: "gpt-oss",
          messages: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: userMessage }],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      const data = await res.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const reply = data.choices[0].message.content;
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } else {
        setError("Nessuna risposta ricevuta. Riprova.");
      }
    } catch (err) {
      setError("Errore di connessione. Controlla la console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askGptOss();
    }
  };

  const showThinking = loading && !messages[messages.length - 1]?.role === "assistant";

  return (
    <div className="gpt-oss-chat">
      {/* Pulsante di toggle — stile GAIA */}
      <button className="gpt-oss-chat__toggle" onClick={handleToggle}>
        {loading ? (
          <svg viewBox="0 0 100 100" className="gpt-oss-chat__toggle-svg gpt-oss-chat__toggle-svg--spin">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#4d9b8a" strokeWidth="3" strokeDasharray="30 20" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#7ecbaa" strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="#b8e6d0" strokeWidth="2" />
            <circle cx="50" cy="50" r="4" fill="#b8e6d0" />
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" className="gpt-oss-chat__toggle-svg">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#4d9b8a" strokeWidth="3" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#7ecbaa" strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="#b8e6d0" strokeWidth="2" />
            <circle cx="50" cy="50" r="4" fill="#b8e6d0" />
          </svg>
        )}
      </button>

      {/* Pannello espandibile */}
      <div
        className={`gpt-oss-chat__panel ${panelHidden ? "gpt-oss-chat__panel--hidden" : ""} ${isOpen ? "gpt-oss-chat__panel--open" : ""}`}
      >
        <div className="gpt-oss-chat__header">
          <h3 className="gpt-oss-chat__title">GPT-OSS</h3>
        </div>

        {/* Area cronologia chat scrollabile */}
        <div className="gpt-oss-chat__messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`gpt-oss-chat__message gpt-oss-chat__message--${msg.role}`}>
              <span className="gpt-oss-chat__message-role">
                {msg.role === "user" ? "Tu" : "GPT-OSS"}
              </span>
              <div className="gpt-oss-chat__message-content">{msg.content}</div>
            </div>
          ))}
          {/* Indicatore di pensiero */}
          {loading && (!messages.length || messages[messages.length - 1].role !== "assistant") && (
            <div className="gpt-oss-chat__message gpt-oss-chat__message--assistant gpt-oss-chat__message--thinking">
              <span className="gpt-oss-chat__message-role">GPT-OSS</span>
              <div className="gpt-oss-chat__thinking-indicator">
                <span className="gpt-oss-chat__thinking-dot" />
                <span className="gpt-oss-chat__thinking-dot" />
                <span className="gpt-oss-chat__thinking-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input + invio */}
        <div className="gpt-oss-chat__input-area">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi qui la tua domanda..."
            rows={2}
            className="gpt-oss-chat__input"
          />
          <button
            onClick={askGptOss}
            disabled={loading || !prompt.trim()}
            className="gpt-oss-chat__send"
          >
            {loading ? (
              <span className="gpt-oss-chat__send-spinner" />
            ) : (
              "Invia"
            )}
          </button>
        </div>

        {error && <div className="gpt-oss-chat__error">{error}</div>}
      </div>
    </div>
  );
}
