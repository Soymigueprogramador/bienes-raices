// Importaciones necesarias.
import express from 'express';
import {
    administradorPropiedades,
} from '../controllers/propiedades.controllers.js';

// Configurando el enrutador.
const router = express.Router();

// Ruta para mis propiedades.
router.get('/misPropiedades', administradorPropiedades);

// Exportacion del router.
export default router;