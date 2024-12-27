// Importando dependencias
import express from 'express';
import path from 'path';
import { __dirname } from './util.js'; 
import userRouter from './routes/user.router.js';
import db from './config/db.js';
import dotenv from 'dotenv';

// Configurando constantes para el servidor
const nameProyect = process.env.NAME_PROYECT
const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurando el motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); 

// Configurando el servidor para mostrar los archivos estaticos. 
app.use(express.static('public'));

// Configuración de rutas
app.use('/', userRouter);

// Conexion a la base de datos.
try {
  await db.authenticate();
  console.log('Conexión exitosa a la base de datos.');
  await db.sync();
} catch (error) {
  console.error('Error al conectar con la base de datos:', error);
}

// Iniciando el servidor
app.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});
