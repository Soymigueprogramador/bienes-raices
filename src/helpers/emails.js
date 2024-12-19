// Importaciones necesarias
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Activando las variables de entorno
dotenv.config();

// Configuración del transporte para correos
const createTransport = () => {
    const isEthereal = process.env.EMAIL_HOST === 'smtp.ethereal.email'; // Detecta si es Ethereal

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587, // Asegura que el puerto sea un número
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Función para enviar correo de confirmación de cuenta
const emailRegistro = async (datos) => {
    const { email, nombre } = datos;
    const transport = createTransport(); // Crear el transporte según configuración

    try {
        const info = await transport.sendMail({
            from: '"Bienes Raíces" <no-reply@bienesraices.com>', // Remitente
            to: email, // Destinatario
            subject: 'Confirma tu cuenta en bienes_raices.com',
            text: 'Confirma tu cuenta en bienes_raices.com',
            html: `
                <p>Hola ${nombre}, necesitamos que confirmes tu cuenta en Bienes Raíces.</p>
                <p>Puedes confirmar tu cuenta desde este enlace: 
                    <a href="#">Confirmar cuenta</a>
                </p>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje. Lamentamos las molestias.</p>
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
    const transport = createTransport(); // Crear el transporte según configuración

    try {
        const info = await transport.sendMail({
            from: '"Prueba" <test@miapp.com>', // Remitente
            to: 'destinatario@ejemplo.com',   // Destinatario
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

// Exportando las funciones
export {
    emailRegistro,
    sendTestEmail,
};