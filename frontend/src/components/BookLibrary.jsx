import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./BookLibrary.css";

export default function BookLibrary({ onSelect }) {
  const { authFetch, user, logout } = useAuth();
  const [books, setBooks] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch("/api/books");
        if (!res.ok) throw new Error("Nu s-au putut încărca cărțile.");
        const data = await res.json();
        if (!cancelled) setBooks(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, [authFetch]);

  return (
    <div className="library-shell">
      <header className="library-header">
        <div className="library-brand">
          <span className="brand-mark" aria-hidden="true">🌿</span>
          <span className="brand-text">Cărțile lui Nini</span>
        </div>
        <div className="library-right">
          <button className="btn-logout" onClick={logout}>Ieși</button>
        </div>
      </header>

      <main className="library-main">
        <h1 className="library-title">
          <span className="library-greeting">Bună, {user?.displayName || user?.username}</span>
          Alege o carte!
        </h1>

        {error && <p className="library-error">🥀 {error}</p>}

        {!books && !error && (
          <div className="library-loading">
            <div className="loading-flower">🌼</div>
            <p>Aranjez rafturile…</p>
          </div>
        )}

        {books && (
          <div className="library-grid">
            {books.map((b) => (
              <BookCard key={b.id} book={b} onSelect={onSelect} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function BookCard({ book, onSelect }) {
  const [wiggle, setWiggle] = useState(false);

  function handleClick() {
    if (!book.locked) {
      onSelect(book.id);
      return;
    }
    // Locked: trigger wiggle animation on lock icon + Coming Soon label
    setWiggle(false);
    requestAnimationFrame(() => setWiggle(true));
  }

  return (
    <button
      className={`book-card${book.locked ? " book-card--locked" : ""}`}
      onClick={handleClick}
      aria-label={book.locked ? `${book.title} — coming soon` : `Deschide cartea: ${book.title}`}
    >
      <div
        className="book-card__cover"
        style={{ backgroundImage: `url(${book.cover})` }}
      >
        {book.locked && (
          <div className="book-card__locked-overlay">
            <span
              className={`book-card__lock${wiggle ? " book-card__lock--wiggle" : ""}`}
              aria-hidden="true"
              onAnimationEnd={() => setWiggle(false)}
            >
              🔒
            </span>
            <span
              className={`book-card__coming${wiggle ? " book-card__coming--wiggle" : ""}`}
            >
              Coming Soon...
            </span>
          </div>
        )}
      </div>
      <div className="book-card__meta">
        <h3 className="book-card__title">{book.title}</h3>
        {book.subtitle && <p className="book-card__subtitle">{book.subtitle}</p>}
        {!book.locked && (
          <span className="book-card__count">{book.pageCount} pagini</span>
        )}
      </div>
    </button>
  );
}
