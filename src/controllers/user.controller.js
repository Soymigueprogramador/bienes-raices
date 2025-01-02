import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import { 
    emailRegistro,
    sendTestEmail,
    olvidePassword,
    sendTestEmailPassword
} from '../helpers/emails.js';
import {
    generandoId, 
    generandoJWT
} from '../helpers/tokend.js'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

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

// Autenticando los usuarios en el login.
const autenticar = async ( req, res ) => {
    // Validacion de email y password. 
    await check('email')
        .isEmail()
        .withMessage('El email debe ser un email válido')
        .run(req);

    await check('password')
        .notEmpty()
        .withMessage('La contraseña debe la misma que definiste al registrarte')
        .run(req);

        const resultados = validationResult(req);
    
        if (!resultados.isEmpty()) {
            return res.render('auth/login', {
                pagina: 'Iniciar sesion',
                errores: resultados.array(),
                
            });
        }

    // comprobando si el usuario existe.
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if ( !user ) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            errores: resultados.array(),
            errores: [{ msg: 'El usuario no esta registrado' }]
        });
    }

    // Comprobacion para los usuarios confirmados.
    if ( !user.confirmado ) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            errores: resultados.array(),
            errores: [{ msg: 'Primero tenes que confirmar tu cuenta antes de iniciar sesion' }]
        });
    }

    // Comprobando el password. 
    if ( !user.verificarPassword(password) ) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            errores: resultados.array(),
            errores: [{ msg: 'Password incorrecto' }]
        });
    } 

    // Autenticar al usuario con jwt.
    const token = generandoJWT({
        id: user.id,
        nombre: user.nombre,
        email: user.email
    });
    return res.cookie('_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
    })//.render('/misPropiedades')
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
const resetearContraseña = async (req, res) => {
    await check('email')
        .isEmail()
        .withMessage('El email debe ser un email válido')
        .run(req);

    const resultados = validationResult(req);

    if (!resultados.isEmpty()) {
        return res.render('auth/recuperarCuenta', {
            pagina: 'Recuperar cuenta',
            errores: resultados.array(),
        });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.render('auth/recuperarCuenta', {
            pagina: 'Recuperar cuenta',
            errores: [{ msg: 'Este email no está registrado' }],
        });
    }

    const generarId = () => uuidv4();
    user.token = generarId(); 
    await user.save();

    // Enviar correo
    olvidePassword({
        email: user.email,
        nombre: user.name,
        token: user.token,
    });

    // Mostrar mensaje al usuario
    return res.render('templates/message', {
        pagina: 'Recupera tu contraseña',
        message: 'Te hemos enviado un correo con las instrucciones para recuperar tu cuenta',
    });
};

// Comprobacion del token del usuario que quiere cambiar su contraseña.
const comprobarToken = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ where: { token } });

        if (!user) {
            return res.render('auth/recuperarCuenta', {
                pagina: 'Error',
                message: 'El token no es válido o ha expirado.',
                error: true,
            });
        }

        res.render('auth/resetPassword', {
            pagina: 'Restablece tu contraseña',
            token: user.token,
        });
    } catch (error) {
        console.error('Error al comprobar el token:', error);
        return res.status(500).render('auth/recuperarCuenta', {
            pagina: 'Error',
            message: 'Hubo un problema al procesar tu solicitud. Intenta más tarde.',
        });
    }
};

// Guardando la nueva contraseña. 
const nuevoPassword = async ( req, res  ) => {
    // Validando el password.
    await check('password')
        .isLength({ min: 4 })
        .withMessage('La contraseña debe tener al menos 4 caracteres')
        .run(req);
    
        const resultados = validationResult(req);
        
        if (!resultados.isEmpty()) {
            return res.render('auth/registro', {
                pagina: 'Restablece tu contraseña',
                errores: resultados.array(),
            });
        };

        const { token } = req.params;
        const { password } = req.body;

        // Identificamos que usuario quiere hacer el cambio de password.
        const user = await User.findOne({ where: { token } });

        // Hasheando el nuevo password. 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.token = null; 
        
        await user.save(); 

        return res.render('auth/cuentaConfirmada', {
            pagina: 'Password restablecido',
            message: 'Tu nueva contraseña se guardo correctamente ',
        });
};

export {
    inicio,
    formLogin,
    formRegistro,
    registrar,
    comprobar,
    recuperarCuenta,
    resetearContraseña,
    comprobarToken,
    nuevoPassword,
    autenticar,
};