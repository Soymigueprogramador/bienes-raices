// Importaciones necesarias para la configuracion de la base de datos. 
import Sequelize from 'sequelize';
import dotenv from 'dotenv';

// Configuracion de la coneccion a la base de datos.
/**
   Los parametros que debemos pasarle son: 
   1- Nombre de la bnase de datos
   2- Nombre del usuario (El nombre por defecto es 'root)
   3- Password de la base de datos
   4- Objeto con mas configuraciones
 */

// Llamando a dotenv.
dotenv.config();

// Constantes para los datos de la base de datos.
const nameDatabase = process.env.NAME_DATABASE;
const nameUserDatabase = process.env.USER_DATABASE;
const passwordDatabase = process.env.PASSWORD_DATABASE;

   const db = new Sequelize(process.env.NAME_DATABASE, process.env.USER_DATABASE, process.env.PASSWORD_DATABASE, {
    host: 'localhost', // Indica el host de la base de datos
    port: process.env.PORT_DATABASE, // Puerto para para MySQL
    dialect: 'mysql', // Define el tipo de base de datos
    define: {
        timestamps: true // Agrega timestamps por defecto en las tablas
    },
    pool: {
        max: 5, // Indica el maximo de conecciones
        min: 0, // Indica el minimo de conecciones
        acquire: 30000, // Indica el tiempo que tarda en mostrar un error
        idle: 10000 // Indica el tiempo que tarda en apagarse si no encuentra conecciones
    },
    logging: false // Desactiva el registro de consultas en consola
}); 

export default db;