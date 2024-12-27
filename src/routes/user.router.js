import express from 'express';
import {
    formLogin,
    formRegistro,
    inicio,
    emailRecuperarCuenta,
    registrar,
    comprobar,
    //cambiarContraseña,
    //comprobarToken,
    //nuevoPassword,
} from '../controllers/user.controller.js';

const router = express.Router();

// Ruta raíz
router.get('/', inicio);

// Login y registro
router.get('/login', formLogin);
router.get('/registro', formRegistro);
router.post('/auth/registro', registrar);

// Confirmar cuenta
router.get('/auth/cuentaConfirmada/:token', comprobar);

// Recuperar cuenta
router.get('/recuperarCuenta', emailRecuperarCuenta);  // Aquí se renderiza la página para ingresar email
//router.post('/auth/cambiarContrasena', cambiarContraseña);  // Aquí se maneja la solicitud de cambio de contraseña

// Ruta para comprobar el token y mostrar la vista para cambiar la contraseña
//router.get('/recuperarCuenta/:token', comprobarToken);  // Verificación del token
//router.post('/recuperarCuenta/:token', nuevoPassword);  // Enviar nueva contraseña al servidor

export default router;
