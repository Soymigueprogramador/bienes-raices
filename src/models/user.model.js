// Inportaciones necesarias para el modelo de usuario de la base de datos.
import { DataTypes, Sequelize } from "sequelize";
import db from '../config/db.js'; 

// Definiendo como se llamara la tabla en MySQL. 
const user = db.define('user', {
    name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN, 
});

export default user; 