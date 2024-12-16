// Importaciones necesarias para el modelo de usuario de la base de datos.
import { DataTypes } from "sequelize";
import db from '../config/db.js'; 

// Definiendo el modelo de la tabla 'user' en MySQL.
const User = db.define('user', {
    name: {
        type: DataTypes.STRING, 
        allowNull: false, 
        validate: {
            notEmpty: { msg: "El campo nombre no puede estar vacío" }
        }
    },
    email: {
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        unique: {
            msg: "El email ya está registrado" 
        },
        validate: {
            isEmail: { msg: "El email debe ser válido" } 
        }
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false, 
        validate: {
            len: [8, 100], 
            notEmpty: { msg: "El campo contraseña no puede estar vacío" }
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    confirmed: {
        type: DataTypes.BOOLEAN, 
        allowNull: true, 
        defaultValue: false 
    }
}, {
    timestamps: true, 
});

export default User;