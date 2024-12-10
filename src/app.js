// Importando dependencias
import express from 'express';
import path from 'path';
import { __dirname } from './util.js'; 
import userRouter from './routes/user.router.js';

// Configurando constantes para el servidor
const nameProyect = 'Bienes Raíces';
const app = express();
const PORT = 8080;

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

// Iniciando el servidor
app.listen(PORT, () => {
  console.log(`Bienvenidos a "${nameProyect}", los esperamos en el puerto ${PORT}`);
});