import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "usuario", 
});

app.post("/usuarios", async (req, res) => {
    const { Usuario, Password } = req.body;

if (!Usuario || !Password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
}

    try {
        await db.query("INSERT INTO usuario (Usuario, Password) VALUES (?, ?)", [
            Usuario,
            Password,
    ]);
    res.json({ success: true, message: "Usuario agregado correctamente" });
} catch (error) {
    console.error("Error al agregar usuario:", error.message);
    res.status(500).json({ success: false, error: "Error al agregar usuario" });
}
});

app.post("/login", async (req, res) => {
    const { Usuario, Password } = req.body;

    if (!Usuario || !Password) {
        return res.status(400).json({ success: false, error: "Datos incompletos" });
    }

    try {
        const [rows] = await db.query(
        "SELECT * FROM usuario WHERE Usuario = ? AND Password = ?",
            [Usuario, Password]
        );

    if (rows.length > 0) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
} catch (error) {
    console.error("Error en el login:", error.message);
    res.status(500).json({ success: false, error: "Error al iniciar sesión" });
}
});

app.get("/usuarios", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM usuario");
        res.json(rows);
}   catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
}
});

app.listen(3001, () => {
    console.log("Server en: http://localhost:3001");
});
