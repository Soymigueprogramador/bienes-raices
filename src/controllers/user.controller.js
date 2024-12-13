// Creando controladores 7 importando los archivos necesarios. 
import user from '../models/user.model.js';
import { check, validationResult } from 'express-validator';

// Controlador para el renderizado de la pagina de inicio.
const inicio = ( req, res ) => {
    res.render('layout/index', {
        autenticado: false
      });
};

// Controlador para el renderizado de la pagina del login
const formLogin = ( req, res ) => {
    res.render('auth/login', {
        paginaLogin: "Iniciar sesion"
      });
};

// Controlador para el renderizado de la pagina del registro. 
const formRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
    });
};

const recuperarCuenta = (req, res) => {
    res.render('auth/recuperarCuenta', {
        paginaRecuperarCuenta: 'Recuperar mi cuenta',
    });
};

const registrar = async (req, res) => {
    // Validación de los campos del formulario de registro
    await check('nombre').notEmpty().withMessage('Este campo es obligatorio').run(req)
    await check('email').isEmail().withMessage('Este campo es obligatorio').run(req);
    await check('password').isStrongPassword().isLength({ min: 8 }).withMessage('Este campo es obligatorio. La contraseña tiene que tener minimo 8 caracteres').run(req);
    await check('repetirPassword').isStrongPassword().isLength({ min: 8 }).withMessage('Este campo es obligatorio. La contraseña tiene que tener minimo 8 caracteres').run(req);

    // Mostrar los resultados de las validaciones
    let resultados = validationResult(req);
    if (!resultados.isEmpty()) {
        return res.status(400).json(resultados.array());
        
    }

    // Desestructuración y validación de los campos
    const { nombre, email, password, repetirPassword } = req.body;

    if (!nombre || !email || !password || !repetirPassword) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            error: 'Todos los campos son obligatorios',
        });
    }

    // Validación de contraseñas
    if (password !== repetirPassword) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            error: 'Las contraseñas no coinciden',
        });
    }

    // Mostrar los datos por consola
    console.log('Datos recibidos:', { nombre, email, password });

    // Simulación de creación del usuario (asegúrate de que user.create sea asincrónico)
    try {
        const user = await User.create(req.body); // Esto supone que usas un modelo User y que create es una función asíncrona
        console.log('Usuario creado:', user);

        // Redireccionar al login
        return res.redirect('/login');
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).render('auth/registro', {
            pagina: 'Crear cuenta',
            error: 'Hubo un error al crear el usuario',
        });
    }
};


export {
    inicio,
    formLogin,
    formRegistro,
    recuperarCuenta,
    registrar
};