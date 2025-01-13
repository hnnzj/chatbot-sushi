import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import Register from "./pages/Register";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
