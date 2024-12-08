// Importando dependencias
import express from 'express';
import { formLogin, formregistro, inicio } from '../controllers/user.controller.js';

const router = express.Router();

// Ruta raíz
router.get('/', inicio);
router.get('/login', formLogin);
router.get('/registro', formregistro);

// Ruta para iniciar sesión
router.get('/login', (req, res) => {
  res.render('auth/login');
});

export default router;