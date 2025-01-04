import express from 'express';
import { administradorPropiedades, crear } from '../controllers/propiedades.controllers.js';

const router = express.Router();

// Ruta para "Mis Propiedades"
router.get('/misPropiedades', administradorPropiedades);

// Ruta para "Crear Propiedad"
router.get('/crear', crear);

// Exportación del router
export default router;