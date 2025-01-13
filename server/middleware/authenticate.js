const jwt = require("jsonwebtoken");

const authenticate = (req) => {
  const token = req;
  let data = "";
  if (!token) {
    return { message: "No se ha proporcionado un token", status: false };
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return { message: "Token inválido" };
    }
    data = decoded;
  });
  return data;
};

module.exports = authenticate;
