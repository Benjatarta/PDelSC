import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos 
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",       
  password: "",       
  database: "usuario",
});

// Listado de usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT Id, Usuario FROM usuario");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Consulta por ID
app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT Id, Usuario FROM usuario WHERE Id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al consultar usuario:", error);
    res.status(500).json({ error: "Error al consultar usuario" });
  }
});

// Alta 
app.post("/usuarios", async (req, res) => {
  const { Usuario, Password } = req.body;

  if (!Usuario || !Password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await db.query("SELECT * FROM usuario WHERE Usuario = ?", [Usuario]);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, error: "El usuario ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Insertar usuario con contraseña encriptada
    await db.query("INSERT INTO usuario (Usuario, Password) VALUES (?, ?)", [Usuario, hashedPassword]);
    
    res.json({ success: true, message: "Usuario agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    res.status(500).json({ error: "Error al agregar usuario" });
  }
});

// Login 
app.post("/login", async (req, res) => {
  const { Usuario, Password } = req.body;

  if (!Usuario || !Password) {
    return res.status(400).json({ success: false, error: "Datos incompletos" });
  }

  try {
    // Buscar usuario
    const [rows] = await db.query("SELECT * FROM usuario WHERE Usuario = ?", [Usuario]);

    if (rows.length === 0) {
      return res.json({ success: false });
    }

    // Verificar contraseña
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(Password, user.Password);

    if (passwordMatch) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ success: false, error: "Error al iniciar sesión" });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { Usuario, Password } = req.body;

  console.log(`PUT /usuarios/${id} recibido:`, req.body);

  try {
    // si hay una nueva contraseña, encriptarla
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      await db.query(
        "UPDATE usuario SET Usuario = ?, Password = ? WHERE Id = ?",
        [Usuario, hashedPassword, id]
      );
    } else {
      // si no hay contraseña, solo actualizar el usuario
      await db.query(
        "UPDATE usuario SET Usuario = ? WHERE Id = ?",
        [Usuario, id]
      );
    }
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Baja
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM usuario WHERE Id = ?", [id]);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});