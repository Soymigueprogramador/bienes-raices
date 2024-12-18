// Creando los emails para la confirmación y recuperación de la cuenta.
// Importaciones necesarias.
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Activando las variables de entorno.
dotenv.config();

// Creando la función para enviar el email de confirmación de la cuenta.
const emailRegistro = async (datos) => {
    const { email, nombre } = datos;
    try {
        // Configuración del transporte con nodemailer.
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Enviando el email de confirmación.
        await transport.sendMail({
            //from: 'Bienes Raíces" <no-reply@bienes_raices.com>',
            //to: email,
            //subject: 'Confirma tu cuenta en bienes_raices.com',
            From: 'from@example.com',
            To: email,
            Subject: 'Confirma tu cuenta en bienes_raices.com',
            text: 'Confirma tu cuenta en bienes_raices.com',
            html: `
                <p>Hola ${nombre}, necesitamos que confirmes tu cuenta en Bienes Raíces.</p>
                <p>Puedes confirmar tu cuenta desde este enlace: 
                    <a href="">Confirmar cuenta</a>
                </p>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje. Lamentamos las molestias.</p>
            `,
        });

        console.log('Correo de confirmación enviado a:', email);
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
        //throw new Error('No se pudo enviar el correo de confirmación.');
    }
};

// Exportando la función.
export {
    emailRegistro,
};