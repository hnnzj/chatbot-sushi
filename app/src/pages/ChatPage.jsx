import React, { useEffect } from "react";
import ChatMessage from "../components/ChatMessage";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

function ChatPage() {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  useEffect(() => {
    socket.connect();
    const fetchData = async () => {
      try {
        await axios.post(
          "http://localhost:5000/api/tokenActive",
          { token },
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        navigate("/login");
        Swal.fire({
          icon: "error",
          title: err.response.data.message,
          text: "Porfavor, ingresa con tu correo y contraseña",
          timer: 1500,
        });
        console.error("Error al verificar el token:");
      }
    };

    fetchData();
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  return (
    <div className="app-container">
      <div>
        <span onClick={handleLogout} className="logout-btn">
          Logout
        </span>
        <div className="chatbot-container">
          <ChatMessage />
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
