import express from 'express';
import {
    formLogin,
    formRegistro,
    inicio,
    recuperarCuenta,
    registrar,
    comprobar,
    cambiarContraseña,
    comprobarToken,
    nuevoPassword,
} from '../controllers/user.controller.js';
i

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
router.get('/recuperarCuenta', recuperarCuenta);
router.post('/auth/cambiarContrasena', cambiarContraseña);

// Ruta para almacenar el nuevo password. 
router.get('/recuperarCuenta/:token', comprobarToken);
router.post('/recuperarCuenta/:token', nuevoPassword);

export default router;