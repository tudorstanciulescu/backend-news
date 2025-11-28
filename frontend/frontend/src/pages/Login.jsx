import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.scss";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("https://backend-news-ww6b.onrender.com/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch {
      alert("Eroare la login - verifică username-ul și parola");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🔐 Login Admin</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Username
          </label>
          <input 
            placeholder="Introdu username-ul" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Parolă
          </label>
          <input 
            type="password" 
            placeholder="Introdu parola"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
        </div>

        <button 
          onClick={login}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="/" style={{ color: "#666", textDecoration: "none" }}>
            ← Înapoi la pagina principală
          </Link>
        </div>

        <div style={{ 
          marginTop: "30px", 
          padding: "15px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "4px",
          fontSize: "14px",
          color: "#666"
        }}>
          <strong>Credențiale test:</strong><br />
          Username: admin<br />
          Parolă: admin123
        </div>
      </div>
    </div>
  );
}
