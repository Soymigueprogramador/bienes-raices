// Importaciones necesarias para el modelo de usuario de la base de datos.
/*import { DataTypes } from "sequelize";
import db from '../config/db.js'; 
import bcrypt from 'bcrypt';

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
    hooks: {
        beforeCreate: async function(User) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt); 
        },
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

export default User;*/




import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';

const User = sequelize.define(
    'User',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
            validate: {
                isEmail: true, 
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        hooks: {
            // Hook para encriptar la contraseña antes de crear el usuario.
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
        },
    }
);

export default User;