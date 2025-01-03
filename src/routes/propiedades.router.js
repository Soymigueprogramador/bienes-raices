// Aca van las rutas de las propiedades. 

// Importaciones necesarias.
import express from 'express';
import {
    administradorPropiedades,
} from '../controllers/propiedades.controllers.js';

// Configurando el enrrutador.
const router = express.Router();

// Ruta raiz de las propiedades.
router.get('/propiedades/misPropiedades', administradorPropiedades);

// Exportacion del router.
export default router;