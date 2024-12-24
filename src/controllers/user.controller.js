import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.model.js';
import { emailRegistro, sendTestEmail, sendTestEmailRecuperarCuenta, recuperarCuenta, } from '../helpers/emails.js';
import { v4 as uuidv4 } from 'uuid';
import { where } from 'sequelize';

// Controlador para confirmar la cuenta
const comprobar = async (req, res) => {
    const { token } = req.params;
    try {
        // Verificando si el token es válido
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).render('auth/cuentaConfirmada', {
                pagina: 'Cuenta no encontrada',
                message: 'El token no es válido o la cuenta ya fue confirmada.',
                error: true,
            });
        }

        // Si el usuario existe, confirmamos su cuenta
        user.token = null;
        user.confirmado = true;
        await user.save();

        return res.render('auth/cuenta-confirmada', {
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

    // Verificar si el usuario ya existe
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
        // Encriptar la contraseña y crear el usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: nombre,
            email,
            password: hashedPassword,
            token,
        });

        // Enviar correo de confirmación
        emailRegistro({
            nombre: user.name,
            email: user.email,
            token: user.token,
        });

        console.log('Token generado:', user.token);

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

// Controladores adicionales
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
        paginaRecuperarCuenta: 'Recuperar mi cuenta',
    });
};

// Cambiar contraseña. 
const cambiarContraseña = async (req, res) => {
    await check('email')
        .isEmail()
        .withMessage('El email debe ser un email válido')
        .run(req);

    const resultados = validationResult(req);

    // Si hay errores en la validación, renderizar con errores
    if (!resultados.isEmpty()) {
        return res.render('auth/recuperarCuenta', {
            errores: resultados.array(),
            paginaRecuperarCuenta: 'Recuperar Cuenta',
        });
    }

    // Buscar un usuario en la base de datos. 
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.render('auth/recuperarCuenta', {
            errores: [{ msg: 'El correo electrónico no está registrado' }],
        });
    }

    // Creando un token para que el usuario recupere su cuenta.
    user.token = generarId();
    await User.save();

    // Le enviamos un email con las intrucciones. 
    recuperarCuenta({
        email,
        nombre: user.nombre,
        token: user.token
    });

    // Le mostramos un mensaje al usuario.
    return res.render('templates/message', {
        pagina: 'Recupera tu cuenta',
        message: 'Te hemos enviado un correo con las instrucciones para que recuperes tu cuenta',
    });

    // Comprobando el token.
    const comprobarToken = async (req, res) => {
        const { token } = req.params;

        try {
            const user = await User.findOne({ where: { token } });

            if (!user) {
                return res.render('auth/recuperarCuenta', {
                    pagina: 'Recuperar Cuenta',
                    errores: [{ msg: 'El token no es válido o ha expirado' }],
                });
            }

            res.render('auth/nuevoPassword', {
                pagina: 'Nueva Contraseña',
                token,
            });
        } catch (error) {
            console.error('Error al comprobar el token:', error);
            res.status(500).render('templates/message', {
                pagina: 'Error',
                message: 'Ocurrió un error al procesar tu solicitud',
            });
        }
    };


    // Almacenando el nuevo password. 
    const nuevoPassword = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;

        try {
            const user = await User.findOne({ where: { token } });

            if (!user) {
                return res.render('auth/recuperarCuenta', {
                    pagina: 'Recuperar Cuenta',
                    errores: [{ msg: 'El token no es válido o ha expirado' }],
                });
            }

            // Actualizar la contraseña
            user.password = await bcrypt.hash(password, 10);
            user.token = null; // Eliminar el token después de usarlo
            await user.save();

            res.render('templates/message', {
                pagina: 'Contraseña Actualizada',
                message: 'Tu contraseña ha sido actualizada exitosamente',
            });
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
            res.status(500).render('templates/message', {
                pagina: 'Error',
                message: 'Ocurrió un error al procesar tu solicitud',
            });
        }
    };
};


// Exportar los controladores.
export {
    inicio,
    formLogin,
    formRegistro,
    //recuperarCuenta,
    registrar,
    comprobar,
    cambiarContraseña,
    nuevoPassword,
    comprobarToken,
};