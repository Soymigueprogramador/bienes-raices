import express from 'express';
import { formLogin, formRegistro, inicio, recuperarCuenta, registrar, comprobar } from '../controllers/user.controller.js';

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
router.get('/recuperar-cuenta', recuperarCuenta);

export default router;