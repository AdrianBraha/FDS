const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Comentarii = require('./Comentarii'); // Import the Comentarii model

const Plangeri = sequelize.define("Plangeri", {
    id_plangere: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    },
    departament: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titlu: {
        type: DataTypes.STRING,
        allowNull: false
    },
    short_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    private: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    uuid:{
        type: DataTypes.STRING,
        allowNull:true
    },
    created_at:{
        type:DataTypes.DATE,
        allowNull:false
    },
    created_by:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
    }, 
    {
        tableName: 'Plangeri',
        timestamps: false,
        freezeTableName: true
    });

Plangeri.associate = (models) => {
    Plangeri.hasMany(models.Comentarii, {
        foreignKey: 'id_plangere',
        as: 'comentarii'
    });
};

module.exports = Plangeri;