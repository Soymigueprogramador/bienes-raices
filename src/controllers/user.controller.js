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
    // Validaciones de los campos del formulario
    await check('nombre')
        .notEmpty()
        .withMessage('El campo nombre es obligatorio')
        .run(req);

    await check('email')
        .isEmail()
        .withMessage('El email debe ser un email válido')
        .run(req);

    await check('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .run(req);

    await check('repetirPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden')
        .run(req);

    // Obtener los resultados de las validaciones
    const resultados = validationResult(req);
    if (!resultados.isEmpty()) {
        // Renderizar la vista con errores y valores para campos no sensibles
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultados.array(),
            datos: { nombre: req.body.nombre, email: req.body.email } // Mantener nombre y email
        });
    }

    // Si no hay errores, procesar los datos
    const { nombre, email, password } = req.body;

    try {
        // Crear el usuario
        const user = await User.create({ nombre, email, password });
        console.log('Usuario creado:', user);

        // Redireccionar al login para evitar el reenvío del formulario
        return res.redirect('/login');
    } catch (error) {
        console.error('Error al crear el usuario:', error);

        // Renderizar con un error general
        return res.status(500).render('auth/registro', {
            pagina: 'Crear cuenta',
            error: 'Hubo un error al crear el usuario'
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