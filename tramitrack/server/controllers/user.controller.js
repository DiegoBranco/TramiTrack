const User = require("../models/user.model");

// Crear usuario (Pruebas - Texto Plano)
exports.register = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    // omit password in response
    const { password, ...userData } = newUser.toObject();
    res.status(201).json({ message: "Usuario creado", data: userData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar", error: error.message });
  }
};

// Login básico (Sin JWT por ahora)
exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const user = await User.findOne({ correo, password });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // don't send password back
    const { password: pw, ...userData } = user.toObject();
    res.json({ message: "Login exitoso", user: userData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el login", error: error.message });
  }
};

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
};
