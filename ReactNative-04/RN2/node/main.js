import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { google } from 'googleapis';

const app = express();
app.use(cors());
app.use(express.json());

//configuracion de multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const uploadsDir = 'uploads/';
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
},
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
}
});

const upload = multer({ 
    storage: storage,
    limits: {
    fileSize: 10 * 1024 * 1024 //limite de 10mb
},
    fileFilter: function (req, file, cb) {
      //acepta imagenes y documentos
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen y documento'));
    }
}
});

app.use('/uploads', express.static('uploads'));

//configuracion oauth2 para google
const oauth2Client = new google.auth.OAuth2(
    '582233369139-c0bjg5il7og2ocng7lu9f00d55cv3phc.apps.googleusercontent.com',
    'benjatarta03@gmail.com', 
    'http://192.168.100.75:8083'
);

//endpoint para manejar callback de google oauth
app.get('/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).send('Código de autorización no encontrado');
        }

    //intercambia codigo por tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

    //obtiene informacion del usuario
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        const { id, email, name, picture } = userInfo.data;

    //redirige al frontend con los datos del usuario
        const redirectUrl = `http://192.168.100.75:8083/?` +
            `oauth_success=true&` +
            `oauth_id=${id}&` +
            `oauth_email=${encodeURIComponent(email || '')}&` +
            `oauth_name=${encodeURIComponent(name || '')}&` +
            `oauth_picture=${encodeURIComponent(picture || '')}`;

        res.redirect(redirectUrl);

    } catch (error) {
        console.error('Error en callback OAuth:', error);
        res.redirect(`http://192.168.100.75:8083/?oauth_error=true`);
    }
});

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "usuario", 
});

//endpoint para subir foto de perfil
app.post('/upload-profile-photo', upload.single('foto_perfil'), async (req, res) => {
    try {
        const { usuario } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }
        
        const fotoUrl = `http://192.168.100.75:3001/uploads/${req.file.filename}`;
        
    //actualiza la url de la foto en la base de datos
        await db.execute(`
            UPDATE usuario 
            SET foto_perfil = ?
            WHERE Usuario = ?
        `, [fotoUrl, usuario]);
        
        res.json({ 
            message: 'Foto de perfil subida exitosamente',
            foto_perfil: fotoUrl
        });
        
    } catch (error) {
        console.error('Error al subir foto de perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

//endpoint para subir documentos
app.post('/upload-document', upload.single('documento'), async (req, res) => {
    try {
        const { usuario } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo' });
        }
        
        const documentoUrl = `http://192.168.100.75:3001/uploads/${req.file.filename}`;
        
    //actualiza la url del documento en la base de datos
        await db.execute(`
            UPDATE usuario 
            SET documentos = ?
            WHERE Usuario = ?
        `, [documentoUrl, usuario]);
        
        res.json({ 
            message: 'Documento subido exitosamente',
            documentos: documentoUrl
        });
        
    } catch (error) {
        console.error('Error al subir documento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.post("/usuarios", async (req, res) => {
    const { Usuario, Password } = req.body;

    if (!Usuario || !Password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const normalizedUsuario = Usuario.trim();
    const normalizedPassword = Password.trim();

    if (!normalizedUsuario || !normalizedPassword) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (normalizedPassword.length > 20) {
        return res.status(400).json({ error: "La contraseña debe tener como máximo 20 caracteres" });
    }

    try {
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        await db.query("INSERT INTO usuario (Usuario, Password, autenticacion) VALUES (?, ?, 'local')", [
            normalizedUsuario,
            hashedPassword,
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

    const normalizedUsuario = Usuario.trim();
    const normalizedPassword = Password.trim();

    if (!normalizedUsuario || !normalizedPassword) {
        return res.status(400).json({ success: false, error: "Datos incompletos" });
    }

    try {
        const [rows] = await db.query(
            "SELECT * FROM usuario WHERE Usuario = ? AND autenticacion = 'local'",
            [normalizedUsuario]
        );

        if (rows.length === 0) {
            return res.json({ success: false });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(normalizedPassword, user.Password || "");

        if (!passwordMatch) {
            return res.json({ success: false });
        }

        const { Password: _removed, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Error en el login:", error.message);
        res.status(500).json({ success: false, error: "Error al iniciar sesión" });
    }
});

//oauth login/registro
app.post("/oauth-login", async (req, res) => {
    const { usuario, email, nombre, apellido, fotoPerfil, autenticacion } = req.body;

    if (!usuario || !autenticacion || !email) {
        return res.status(400).json({ success: false, error: "Datos incompletos para OAuth" });
    }

    try {
            //verifica si el usuario ya existe para evitar duplicados
        const [existingUsers] = await db.query(
            "SELECT * FROM usuario WHERE Email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
                //si el usuario existe actualiza informacion sin perder datos
            const existingUser = existingUsers[0];
            await db.query(`
                UPDATE usuario 
                SET Usuario = ?, Nombre = ?, Apellido = ?, foto_perfil = ?, autenticacion = ?
                WHERE Email = ?
            `, [usuario, nombre || existingUser.Nombre, apellido || existingUser.Apellido, fotoPerfil || existingUser.foto_perfil, autenticacion, email]);
            
                //obtiene datos actualizados completos
            const [updatedUser] = await db.query("SELECT * FROM usuario WHERE Email = ?", [email]);
            
            res.json({ success: true, user: updatedUser[0], message: "Usuario actualizado" });
        } else {
                //crea usuario oauth nuevo
            await db.query(`
                INSERT INTO usuario 
                (Usuario, Email, Nombre, Apellido, foto_perfil, autenticacion) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [usuario, email, nombre, apellido, fotoPerfil, autenticacion]);
            
                //obtiene el usuario recien creado
            const [newUser] = await db.query("SELECT * FROM usuario WHERE Email = ?", [email]);
            
            res.json({ success: true, user: newUser[0], message: "Usuario OAuth registrado correctamente" });
        }
    } catch (error) {
        console.error("Error en OAuth login:", error.message);
        res.status(500).json({ success: false, error: "Error en autenticación OAuth" });
    }
});

//actualiza perfil de usuario
app.put("/usuario/:usuario", async (req, res) => {
    const { usuario } = req.params;
    const { Nombre, Apellido, Email, Telefono, Direccion, foto_perfil, documentos } = req.body;

    try {
        await db.query(`
            UPDATE usuario 
            SET Nombre = ?, Apellido = ?, Email = ?, Telefono = ?, Direccion = ?, 
                foto_perfil = ?, documentos = ?
            WHERE Usuario = ?
        `, [Nombre, Apellido, Email, Telefono, Direccion, foto_perfil, documentos, usuario]);
        
        res.json({ success: true, message: "Perfil actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar perfil:", error.message);
        res.status(500).json({ success: false, error: "Error al actualizar perfil" });
    }
});

//obtiene perfil de usuario
app.get("/usuario/:usuario", async (req, res) => {
    const { usuario } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM usuario WHERE Usuario = ?", [usuario]);
        
        if (rows.length > 0) {
            res.json({ success: true, user: rows[0] });
        } else {
            res.status(404).json({ success: false, error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener perfil:", error.message);
        res.status(500).json({ success: false, error: "Error al obtener perfil" });
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT Id, Usuario, Email, Nombre, Apellido, autenticacion FROM usuario");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

//endpoint temporal para limpiar usuarios duplicados
app.post("/clean-duplicates", async (req, res) => {
    try {
    console.log("Iniciando limpieza de usuarios duplicados...");
        
    //encuentra usuarios duplicados por email
        const [duplicates] = await db.query(`
            SELECT Email, COUNT(*) as count, GROUP_CONCAT(Id) as ids
            FROM usuario 
            WHERE Email IS NOT NULL AND Email != ''
            GROUP BY Email 
            HAVING count > 1
        `);
        
    console.log("Usuarios duplicados encontrados:", duplicates);
        
        let cleaned = 0;
        for (const duplicate of duplicates) {
            const ids = duplicate.ids.split(',');
            //mantiene solo el primer registro mas antiguo
            const toKeep = ids[0];
            const toDelete = ids.slice(1);
            
            console.log(`Email: ${duplicate.Email} - manteniendo id ${toKeep}, eliminando ids: ${toDelete.join(', ')}`);
            
            for (const id of toDelete) {
                await db.query("DELETE FROM usuario WHERE Id = ?", [id]);
                cleaned++;
            }
        }
        
    console.log(`Limpieza completada. ${cleaned} usuarios duplicados eliminados.`);
        res.json({ 
            success: true, 
            message: `${cleaned} usuarios duplicados eliminados`,
            duplicatesFound: duplicates.length
        });
    } catch (error) {
    console.error("Error limpiando duplicados:", error.message);
        res.status(500).json({ error: "Error al limpiar duplicados" });
    }
});

app.listen(3001, '0.0.0.0', () => {
    console.log("Server en: http://localhost:3001");
    console.log("Server también disponible en: http://192.168.100.75:3001");
});
