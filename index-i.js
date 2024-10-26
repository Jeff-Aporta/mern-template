import express from 'express';
import path from 'path';
import cors from 'cors';

// Para trabajar con rutas, necesitamos usar el módulo 'url' para obtener el __dirname.
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Permitir solicitudes de diferentes dominios
app.use(express.json()); // Para parsear JSON

// Ruta para servir el frontend de React
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Manejar otras rutas, puedes agregar tus APIs aquí
app.get('/api', (req, res) => {
    res.json({ message: '¡Hola desde el backend!' });
});

// Cualquier otra ruta que no esté definida devolverá la página principal de React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
