require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
var cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("./models/product.model");
const { setOrder, showOrders } = require("./services");
const iniciarChat = require("./services/chat.service");
const userRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");
const authenticate = require("./middleware/authenticate");
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", ordersRoutes);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let menu = [];
const cargarMenu = async () => {
  menu = await Product.find();
};
cargarMenu();
const chat = async ({ userMessage, token }) => {
  try {
    if (!cargarMenu.length) await cargarMenu();

    const chat = iniciarChat(genAI, menu);

    const functions = {
      cargarPedido: (products) => setOrder(products, token),
      verOrdenes: (user) => showOrders(user, token),
    };

    const chatResponse = await chat.sendMessage(userMessage);

    if (chatResponse.response.functionCalls()) {
      const call = chatResponse.response.functionCalls()[0];
      if (functions[call.name]) {
        const response = await functions[call.name](call.args, token);

        const result2 = await chat.sendMessage([
          {
            functionResponse: {
              name: call.name,
              response: response,
            },
          },
        ]);
        return result2.response.candidates[0].content.parts[0].text;
      }
    }
    return chatResponse.response;
  } catch (error) {
    if (error.message.includes("Token")) {
      console.error("Error con el token:", error);
      return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }

    console.error("Error inesperado en el chat:", error);
    return "Hubo un error interno. Por favor, contacta al soporte.";
  }
};

io.on("connection", (socket) => {
  console.log("Usuario conectado");
  const cookies = socket.handshake.headers.cookie;
  const token = cookies && cookies.split("=")[1];
  let user = authenticate(token);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
  socket.on("mensaje", async (data) => {
    try {
      if (user.status == false) {
        socket.emit("respuesta", {
          auth: false,
          message: "No estás autenticado. Por favor, inicia sesión.",
        });
        return;
      }
      const response = await chat({ userMessage: data.message, token: token });
      if (typeof response == "string")
        socket.emit("respuesta", { message: response });
      else
        socket.emit("respuesta", {
          message: response.candidates[0].content.parts[0].text,
        });
    } catch (error) {
      console.error("Error procesando mensaje:", error.message);
      socket.emit("respuesta", {
        message: "Ocurrió un error procesando tu mensaje. Intenta de nuevo.",
      });
    }
  });
});

io.listen(process.env.SOCKET_PORT || 5002);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});
