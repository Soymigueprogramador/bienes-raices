// Importaciones necesarias
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Activando las variables de entorno
dotenv.config();

// Configuración del transporte para correos
const createTransport = () => {
    const isEthereal = process.env.EMAIL_HOST === 'smtp.ethereal.email'; 

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Función para enviar correo de confirmación de cuenta
const emailRegistro = async (datos) => {
    const { nombre, email, token, } = datos;
    const transport = createTransport(); 

    try {
        const info = await transport.sendMail({
            from: '"Bienes Raíces" <no-reply@bienesraices.com>', 
            to: email, 
            subject: 'Recupera tu cuenta en bienes_raices.com',
            text: 'Recupera tu cuenta en bienes_raices.com',
            html: `
                <p>Hola ${nombre}, Te mandamos este email para que puedas confirmar tu cuenta.</p>
                <p>Puedes recuperar tu cuenta desde este enlace: 
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8080}/auth/cuenta-confirmada/${token}"> Confirmar cuenta </a>
                </p>
                <p>Si no te registraste en nuestra pagina web, puedes ignorar este mensaje. Lamentamos las molestias.</p>
            `,
        });

        console.log('Correo de confirmación enviado a:', email);

        // Si es Ethereal, muestra la URL del correo en consola
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
            console.log('URL para visualizar el correo:', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
    }
};

// Función para enviar correo de prueba
const sendTestEmail = async () => {
    const transport = createTransport(); 

    try {
        const info = await transport.sendMail({
            from: '"Prueba" <test@miapp.com>', 
            to: 'destinatario@ejemplo.com',   
            subject: 'Confirmar mi cuenta',
            text: 'Confirmar mi cuenta.',
            html: '<p>Este es un correo de <strong>prueba</strong>.</p>',
        });

        console.log('Correo enviado:', info.messageId);

        // Si es Ethereal, muestra la URL del correo en consola
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
            console.log('URL para visualizar el correo:', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

// Función para enviar correo con instrucciones para recuperar la cuenta.
const olvidePassword = async (datos) => {
    const { nombre, email, token, } = datos;
    const transport = createTransport(); 

    try {
        const info = await transport.sendMail({
            from: '"Bienes Raíces" <no-reply@bienesraices.com>', 
            to: email, 
            subject: 'Recupera tu cuenta en bienes_raices.com',
            text: 'Recupera tu cuenta en bienes_raices.com',
            html: `
                <p>Hola ${nombre}, Te mandamos este email para que puedas recuperar la contraseña de tu cuenta.</p>
                <p>Puedes recuperar tu cuenta desde este enlace: 
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8080}/auth/recuperarCuenta/${token}"> Recuperar contraseña </a>
                </p>
                <p>Si no necesitas recuperar esta cuenta, puedes ignorar este mensaje. Lamentamos las molestias.</p>
            `,
        });

        console.log('Correo de confirmación enviado a:', email);

        // Si es Ethereal, muestra la URL del correo en consola
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
            console.log('URL para visualizar el correo:', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
    }
};

// Función para enviar correo de prueba
const sendTestEmailPassword = async () => {
    const transport = createTransport(); 

    try {
        const info = await transport.sendMail({
            from: '"Prueba" <test@miapp.com>', 
            to: 'destinatario@ejemplo.com',   
            subject: 'Correo de prueba desde Ethereal',
            text: 'Este es un correo de prueba.',
            html: '<p>Este es un correo de <strong>prueba</strong>.</p>',
        });

        console.log('Correo enviado:', info.messageId);

        // Si es Ethereal, muestra la URL del correo en consola
        if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
            console.log('URL para visualizar el correo:', nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

export {
    emailRegistro,
    sendTestEmail,
    olvidePassword,
    sendTestEmailPassword
};