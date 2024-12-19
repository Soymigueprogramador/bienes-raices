// Importando dependencias
import express from 'express';
import { formLogin, formRegistro, inicio, recuperarCuenta, registrar, comprobar, } from '../controllers/user.controller.js';

const router = express.Router();

// Ruta raíz
router.get('/', inicio);
router.get('/login', formLogin);
router.get('/comprobar/:token', comprobar);
router.get('/registro', formRegistro);
router.post('/auth/registro', registrar);

// Ruta para iniciar sesión
router.get('/login', (req, res) => {
  res.render('auth/login');
});

export default router;