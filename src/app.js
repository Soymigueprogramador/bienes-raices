// Importando dependencias
import express from 'express';
import userRouter from './routes/user.router.js';

// Configurando constantes para el servidor
export const nameProyect = 'Bienes Raíces';
const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Configurando el motor de plantilla, en este caso usamos pug.
app.set('view engine', 'pug');
app.set('views', './views');

// Llamando a las rutas.
app.use('/auth', userRouter);

// Iniciando el servidor
app.listen(PORT, () => {
    console.log(`Bienvenidos a ${nameProyect}, los esperamos en el puerto ${PORT}`);
});
