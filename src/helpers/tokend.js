// Importacion de dependencias necesarias.
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

// Configurando las variables de entorno.
dotenv.config();

// Generando tokens.
const generandoId = () => {
    return new Date().getTime().toString(32) + Math.random().toString(32).substring(2);
};

// Generando y mostrando el ID.
const token = generandoId();
//console.log(token);

// Funcion para crear un JWt. 
const generandoJWT = datos => jwt.sign({
        id: datos.id,
        nombre: datos.nombre,
        email: datos.email
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' });

// Exportando. 
export  {
    generandoId, 
    generandoJWT
};