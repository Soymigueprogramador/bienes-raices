import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import { generandoId } from '../helpers/tokend.js';
import { emailRegistro } from '../helpers/emails.js';

// Controlador para confirmar la cuenta
const comprobar = (req, res, next) => {
    console.log('Comprobando la cuenta...!');
    const { token } = req.params;
    console.log(token);
    next();
};

// Controlador para el renderizado de la página de inicio
const inicio = (req, res) => {
    res.render('layout/index', {
        autenticado: false,
    });
};

// Controlador para el renderizado de la página de login
const formLogin = (req, res) => {
    res.render('auth/login', {
        paginaLogin: "Iniciar sesión",
    });
};

// Controlador para el renderizado de la página de registro
const formRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
    });
};

// Controlador para el renderizado de la página de recuperación de cuenta
const recuperarCuenta = (req, res) => {
    res.render('auth/recuperarCuenta', {
        paginaRecuperarCuenta: 'Recuperar mi cuenta',
    });
};

// Controlador para registrar un usuario nuevo
const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El campo nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email debe ser un email válido').run(req);
    await check('password').isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres').run(req);
    await check('repetirPassword').custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden').run(req);

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

    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'Este usuario ya existe' }],
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
            },
        });
    }

    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: nombre,
            email,
            password: hashedPassword,
            yocken: generandoId(),
        });

        emailRegistro({
            nombre: user.name,
            email: user.email,
            token: user.yocken,
        });

        return res.render('templates/message', {
            pagina: 'Cuenta creada',
            message: 'Te hemos enviado un correo con las instrucciones para que confirmes tu cuenta'
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'Hubo un error al crear el usuario' }],
        });
    }
};

// Exportar los controladores
export {
    inicio,
    formLogin,
    formRegistro,
    recuperarCuenta,
    registrar,
    comprobar,
};
