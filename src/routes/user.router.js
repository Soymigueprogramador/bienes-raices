import express from 'express';
import { nameProyect } from '../app.js';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login');
});


export default router;