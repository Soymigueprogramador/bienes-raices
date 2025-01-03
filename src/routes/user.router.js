// Aca van las rutas de los usuarios.

// Importaciones necesarias.
import express from 'express';
import {
    formLogin,
    formRegistro,
    inicio,
    registrar,
    comprobar,
    recuperarCuenta,
    resetearContraseña,
    comprobarToken,
    nuevoPassword,
    autenticar
} from '../controllers/user.controller.js';

const router = express.Router();

// Ruta raíz
router.get('/', inicio);

// Login y registro
router.get('/login', formLogin);
router.post('/auth/login', autenticar);


router.get('/registro', formRegistro);
router.post('/auth/registro', registrar);

// Confirmar cuenta
router.get('/auth/cuenta-confirmada/:token', comprobar);

// Recuperar cuenta 
router.get('/recuperarCuenta', recuperarCuenta);
router.post('/recuperarCuenta', resetearContraseña);

// Guardando la nueva contraseña. 
router.get('/auth/recuperarCuenta/:token', comprobarToken);
router.post('/auth/recuperarCuenta/:token', nuevoPassword);


export default router;