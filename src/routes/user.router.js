// Importando dependencias
import express from 'express';

const router = express.Router();

// Ruta raíz
router.get('/', (req, res) => {
  res.render('auth/index');
});

// Ruta para iniciar sesión
router.get('/login', (req, res) => {
  res.render('auth/login');
});

export default router;