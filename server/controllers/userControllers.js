const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exist = await User.findOne({ email: email });
    if (exist) {
      return res.status(400).json({ message: "Este usuario ya existe" });
    }

    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(200).json({
      message: "Usuario creado",
      user: { nombre: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Usuario inexistente" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { secure: false });

    return res.status(200).json({
      message: "Login exitoso",
      id: user._id,
      email: user.email,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const tokenVerify = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token no proporcionado" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      return res.status(200).json({
        message: "Token válido",
        auth: true,
        data: decoded,
      });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Token inválido" });
    } else {
      return res
        .status(500)
        .json({ message: "Error interno del servidor", error: error.message });
    }
  }
};

module.exports = { loginUser, registerUser, tokenVerify };
