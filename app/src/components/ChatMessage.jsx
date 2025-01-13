import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
function ChatMessage() {
  const chatBox = useRef(null);
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([
    { message: "Hola, en que te puedo ayudar? ", model: "message-bot" },
  ]);

  const [userMessage, setUserMessage] = useState("");

  const handleUserMessage = (e) => {
    e.preventDefault();
    setUserMessage(e.target.value);
  };

  useEffect(() => {
    chatBox.current.scrollTop = chatBox.current.scrollHeight;
  }, [chatHistory]);

  useEffect(() => {
    socket.on("respuesta", (data) => {
      data.auth === false && navigate("/login");
      setChatHistory((prev) => [
        ...prev,
        { message: data.message, model: "message-bot" },
      ]);
    });
  }, []);
  const submitUserMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    try {
      socket.emit("mensaje", { message: userMessage });
      setChatHistory((prev) => [
        ...prev,
        { message: userMessage, model: "message-user" },
      ]);
    } catch (error) {
      console.error("Error al obtener la respuesta del bot:", error);
    } finally {
      setUserMessage("");
    }
  };

  return (
    <div className="message-box">
      <div className="chat-message-container" ref={chatBox}>
        {chatHistory.map((el) => (
          <p className={el.model}>{el.message}</p>
        ))}
      </div>

      <div className="chat-input-container">
        <form onSubmit={submitUserMessage}>
          <input
            value={userMessage}
            placeholder="Envia un mensaje..."
            onChange={handleUserMessage}
          />
        </form>
      </div>
    </div>
  );
}

export default ChatMessage;
