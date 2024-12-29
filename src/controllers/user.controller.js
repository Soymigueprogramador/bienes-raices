
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import { emailRegistro } from '../helpers/emails.js';
import { v4 as uuidv4 } from 'uuid';
import { where } from 'sequelize';

// Controlador para confirmar la cuenta
const comprobar = async (req, res) => {   
    const { token } = req.params;
    try {
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).render('auth/cuentaConfirmada', {
                pagina: 'Cuenta no encontrada',
                message: 'El token no es válido o la cuenta ya fue confirmada.',
                error: true,
            });
        }

        user.token = null;
        user.confirmado = true;
        await user.save();

        return res.render('auth/cuentaConfirmada', {
            pagina: 'Cuenta confirmada',
            message: '¡Cuenta confirmada exitosamente!',
        });
    } catch (error) {
        console.error('Error al comprobar la cuenta:', error);
        return res.status(500).render('auth/cuentaConfirmada', {
            pagina: 'Error al confirmar tu cuenta',
            message: 'Ocurrió un error inesperado. Por favor, intenta más tarde.',
        });
    }
};


// Controlador para registrar un usuario nuevo
const registrar = async (req, res) => {
    await check('nombre')
        .notEmpty()
        .withMessage('El campo nombre es obligatorio')
        .run(req);

    await check('email')
        .isEmail()
        .withMessage('El email debe ser un email válido')
        .run(req);

    await check('password')
        .isLength({ min: 4 })
        .withMessage('La contraseña debe tener al menos 4 caracteres')
        .run(req);

    await check('repetirPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Las contraseñas no coinciden')
        .run(req);

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
    const token = uuidv4();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: nombre,
            email,
            password: hashedPassword,
            token,
        });

        // Enviar correo de confirmación
        await emailRegistro({
            nombre: user.name,
            email: user.email,
            token: user.token,
        });

        return res.render('templates/message', {
            pagina: 'Cuenta creada',
            message: 'Te hemos enviado un correo con las instrucciones para que confirmes tu cuenta',
        });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'Hubo un error al crear el usuario' }],
        });
    }
};

// Otros controladores
const inicio = (req, res) => {
    res.render('layout/index', {
        autenticado: false,
    });
};

const formLogin = (req, res) => {
    res.render('auth/login', {
        paginaLogin: 'Iniciar sesión',
    });
};

const formRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
    });
};

const recuperarCuenta = (req, res) => {
    res.render('auth/recuperarCuenta', {
        pagina: 'Recuperar cuenta',
    });
};

// Funcion para recuperar la contraseña.
const resetearContraseña = async ( req, res ) => {
    await check('email')
        .isEmail()
        .withMessage('El email debe ser un email válido')
        .run(req);

        const resultados = validationResult(req);
        
        if (!resultados.isEmpty()) {
            return res.render('auth/recuperarCuenta', {
                pagina: 'Recuperar cuenta',
                errores: resultados.array()
            });
        };

    // Buscando si el usuario existe en la base de datos. 
    const { email } = req.body;

    const user = await User.findOne({ where: { email }});

    if( !user ) {
        return res.render('auth/recuperarCuenta', {
            pagina: 'Recuperar cuenta',
            errores: [{ msg: 'Este email no está registrado' }]
        });
    }
};

export {
    inicio,
    formLogin,
    formRegistro,
    registrar,
    comprobar,
    recuperarCuenta,
    resetearContraseña
};