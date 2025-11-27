import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.scss";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("https://backend-news-tr9k.onrender.com/news").then(res => setNews(res.data));
  }, []);

  return (
    <div>
      {/* Header cu meniu */}
      <header style={{ 
        backgroundColor: "#333", 
        color: "white", 
        padding: "20px",
        marginBottom: "30px"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h1 style={{ margin: 0 }}>📰 Portal de Știri</h1>
          
          <nav>
            <ul style={{ 
              listStyle: "none", 
              display: "flex", 
              gap: "20px",
              margin: 0,
              padding: 0
            }}>
              <li><Link to="/" style={{ color: "white", textDecoration: "none" }}>Acasă</Link></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Sport</a></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Politică</a></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Tehnologie</a></li>
              <li><a href="#" style={{ color: "white", textDecoration: "none" }}>Cultură</a></li>
              <li><Link to="/login" style={{ color: "#ffc107", textDecoration: "none", fontWeight: "bold" }}>Admin</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Conținut principal */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <h2 style={{ marginBottom: "30px" }}>Ultimele Știri</h2>
        
        <div style={{ display: "grid", gap: "20px" }}>
          {news.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              Nu există știri momentan. Loghează-te ca admin pentru a adăuga știri.
            </p>
          ) : (
            news.map(n => (
              <article key={n._id} style={{ 
                border: "1px solid #ddd", 
                padding: "20px",
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ marginTop: 0, color: "#333" }}>{n.title}</h3>
                <p style={{ lineHeight: "1.6", color: "#555" }}>{n.content}</p>
                <small style={{ color: "#999" }}>
                  📅 {new Date(n.date).toLocaleString('ro-RO')}
                </small>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "20px",
        marginTop: "50px",
        textAlign: "center",
        color: "#666"
      }}>
        <p>© 2025 Portal de Știri. Toate drepturile rezervate.</p>
      </footer>
    </div>
  );
}
