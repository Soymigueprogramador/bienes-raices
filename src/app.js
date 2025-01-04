// Importando dependencias
import express from 'express';
import path from 'path';
import { __dirname } from './util.js';
import userRouter from './routes/user.router.js';
import propiedadesRouter from './routes/propiedades.router.js';
import db from './config/db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Carga de variables de entorno
dotenv.config();

// Configurando constantes para el servidor
const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configurando el motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Configurando el servidor para mostrar los archivos estáticos
app.use(express.static('public'));

// Configuración de rutas
app.use('/', userRouter);
app.use('/propiedades', propiedadesRouter);

// Conexión a la base de datos
try {
  await db.authenticate();
  console.log('Conexión exitosa a la base de datos.');
  await db.sync();
} catch (error) {
  console.error('Error al conectar con la base de datos:', error);
}

// Iniciando el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});