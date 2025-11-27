import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Admin.scss";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [news, setNews] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  
  // State pentru crearea de admini noi
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showAdminList, setShowAdminList] = useState(false);
  const [adminList, setAdminList] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadNews();
  }, [token, navigate]);

  const loadNews = async () => {
    try {
      const res = await axios.get("https://backend-news-tr9k.onrender.com/news");
      setNews(res.data);
    } catch (err) {
      console.error("Eroare la încărcarea știrilor:", err);
    }
  };

  const postNews = async () => {
    if (!title || !content) {
      alert("Te rog completează titlul și conținutul!");
      return;
    }

    try {
      await axios.post(
        "https://backend-news-tr9k.onrender.com/news",
        { title, content },
        { headers: { Authorization: token } }
      );
      alert("✅ Știre postată cu succes!");
      setTitle("");
      setContent("");
      loadNews();
    } catch (err) {
      alert("❌ Eroare la postarea știrii!");
      console.error(err);
    }
  };

  const deleteNews = async (id) => {
    if (window.confirm("Sigur vrei să ștergi această știre?")) {
      try {
        await axios.delete(`https://backend-news-tr9k.onrender.com/news/${id}`, {
          headers: { Authorization: token }
        });
        alert("✅ Știre ștearsă cu succes!");
        loadNews();
      } catch (err) {
        alert("❌ Eroare la ștergerea știrii!");
        console.error(err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const createAdmin = async () => {
    if (!newAdminUsername || !newAdminPassword) {
      alert("Te rog completează username-ul și parola!");
      return;
    }

    if (newAdminPassword.length < 6) {
      alert("Parola trebuie să aibă cel puțin 6 caractere!");
      return;
    }

    try {
      await axios.post("https://backend-news-tr9k.onrender.com/auth/register", {
        username: newAdminUsername,
        password: newAdminPassword
      });
      alert(`✅ Admin "${newAdminUsername}" creat cu succes!`);
      setNewAdminUsername("");
      setNewAdminPassword("");
      setShowAdminForm(false);
      // Reîncarcă lista de admini dacă este vizibilă
      if (showAdminList) {
        loadAdmins();
      }
    } catch (err) {
      if (err.response && err.response.data) {
        alert(`❌ Eroare: ${err.response.data}`);
      } else {
        alert("❌ Eroare la crearea adminului!");
      }
      console.error(err);
    }
  };

  const loadAdmins = async () => {
    try {
      const res = await axios.get("https://backend-news-tr9k.onrender.com/auth/users");
      setAdminList(res.data);
    } catch (err) {
      console.error("Eroare la încărcarea adminilor:", err);
      alert("❌ Eroare la încărcarea listei de admini!");
    }
  };

  const toggleAdminList = () => {
    if (!showAdminList) {
      loadAdmins();
    }
    setShowAdminList(!showAdminList);
  };

  if (!token) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header Admin */}
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
          <h1 style={{ margin: 0 }}>🔧 Panou Admin</h1>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              🏠 Vezi Site-ul
            </Link>
            <button 
              onClick={logout}
              style={{ 
                backgroundColor: "#dc3545", 
                color: "white", 
                padding: "10px 20px", 
                border: "none", 
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Conținut principal */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Secțiune Creare Admin */}
          <div style={{ 
            backgroundColor: "white",
            marginBottom: "30px", 
            padding: "20px", 
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "2px solid #ffc107",
            color: "#333"
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ margin: 0 }}>👤 Gestionare Admini</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={toggleAdminList}
                style={{
                  backgroundColor: showAdminList ? "#6c757d" : "#17a2b8",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {showAdminList ? "🔼 Ascunde Lista" : "📋 Vezi Toți Adminii"}
              </button>
              <button 
                onClick={() => setShowAdminForm(!showAdminForm)}
                style={{
                  backgroundColor: showAdminForm ? "#6c757d" : "#ffc107",
                  color: showAdminForm ? "white" : "#333",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                {showAdminForm ? "❌ Anulează" : "➕ Creează Admin Nou"}
              </button>
            </div>
          </div>

          {showAdminList && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
              <h3 style={{ marginTop: 0 }}>Lista Admini ({adminList.length})</h3>
              {adminList.length === 0 ? (
                <p style={{ color: "#666" }}>Se încarcă...</p>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {adminList.map((admin, index) => (
                    <div key={admin._id} style={{
                      padding: "15px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "4px",
                      border: "1px solid #dee2e6",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <strong style={{ fontSize: "16px" }}>👤 {admin.username}</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          Creat: {new Date(admin.createdAt).toLocaleString('ro-RO')}
                        </small>
                      </div>
                      <span style={{
                        padding: "5px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}>
                        ADMIN
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {showAdminForm && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #ddd" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                  Username
                </label>
                <input 
                  placeholder="Introdu username-ul noului admin" 
                  value={newAdminUsername}
                  onChange={e => setNewAdminUsername(e.target.value)} 
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    backgroundColor: "#fff",
                    color: "#333"
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
                  Parolă (min. 6 caractere)
                </label>
                <input 
                  type="password"
                  placeholder="Introdu parola noului admin" 
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    backgroundColor: "#fff",
                    color: "#333"
                  }}
                />
              </div>
              <button 
                onClick={createAdmin}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  padding: "12px 30px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✅ Creează Admin
              </button>
              <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
                ⚠️ <strong>Notă:</strong> Noul admin va avea aceleași drepturi ca tine (poate posta, șterge știri și crea alți admini).
              </p>
            </div>
          )}
        </div>

        {/* Formular postare știre */}
        <div style={{ 
          backgroundColor: "white",
          marginBottom: "30px", 
          padding: "30px", 
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: "#333"
        }}>
          <h2 style={{ marginTop: 0 }}>➕ Postează Știre Nouă</h2>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              Titlu
            </label>
            <input 
              placeholder="Introdu titlul știrii" 
              value={title}
              onChange={e => setTitle(e.target.value)} 
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                backgroundColor: "#fff",
                color: "#333"
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              Conținut
            </label>
            <textarea 
              placeholder="Introdu conținutul știrii" 
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px", 
                border: "1px solid #ddd",
                borderRadius: "4px",
                minHeight: "150px",
                fontSize: "16px",
                fontFamily: "inherit",
                backgroundColor: "#fff",
                color: "#333"
              }}
            />
          </div>
          <button 
            onClick={postNews}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px 30px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            📤 Publică Știrea
          </button>
        </div>

        {/* Lista de știri */}
        <div style={{ 
          backgroundColor: "white",
          padding: "30px", 
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          color: "#333"
        }}>
          <h2 style={{ marginTop: 0 }}>📋 Gestionează Știri ({news.length})</h2>
          
          {news.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              Nu există știri. Adaugă prima știre folosind formularul de mai sus.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {news.map(n => (
                <div key={n._id} style={{ 
                  padding: "20px", 
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f8f9fa"
                }}>
                  <h3 style={{ marginTop: 0, color: "#333" }}>{n.title}</h3>
                  <p style={{ lineHeight: "1.6", color: "#555" }}>{n.content}</p>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    marginTop: "15px"
                  }}>
                    <small style={{ color: "#999" }}>
                      📅 {new Date(n.date).toLocaleString('ro-RO')}
                    </small>
                    <button 
                      onClick={() => deleteNews(n._id)}
                      style={{ 
                        backgroundColor: "#dc3545", 
                        color: "white",
                        padding: "8px 20px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      🗑️ Șterge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
