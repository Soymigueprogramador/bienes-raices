import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';

// Controlador para el renderizado de la página de inicio.
const inicio = (req, res) => {
    res.render('layout/index', {
        autenticado: false
    });
};

// Controlador para el renderizado de la página del login.
const formLogin = (req, res) => {
    res.render('auth/login', {
        paginaLogin: "Iniciar sesión"
    });
};

// Controlador para el renderizado de la página de registro.
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
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultados.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
            },
        });
    }

    // Si no hay errores, procesar los datos
    const { nombre, email, password } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await User.create({
            name: nombre, // Mapear "nombre" a "name"
            email,
            password: hashedPassword,
        });

        console.log('Usuario creado:', user);

        // Redireccionar al login
        return res.redirect('/login');
    } catch (error) {
        console.error('Error al crear el usuario:', error);

        // Renderizar la página con el mensaje de error
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
