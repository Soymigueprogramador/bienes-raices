import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../config/db.js';

const User = sequelize.define(
    'User',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false, // Campo obligatorio
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
            allowNull: false, // Campo obligatorio
        },
        token: { 
            type: DataTypes.STRING,
            allowNull: true, 
        },
        confirmado: { 
            type: DataTypes.BOOLEAN,
            defaultValue: false, 
            allowNull: false, 
        },
    },
    {
        hooks: {
            // Hook para encriptar la contraseña antes de guardar un nuevo usuario
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
        },
    }
);

export default User;