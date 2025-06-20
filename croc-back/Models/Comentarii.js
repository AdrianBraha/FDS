const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Plangeri = require('./PLANGERII'); // Import the Plangeri model

const Comentarii = sequelize.define("Comentarii", {
    id_comentariu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_plangere: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: { 
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    created_by:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      culoare: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
    
    }, 
    {
        tableName: 'Comentarii',
        timestamps: false,
        freezeTableName: true
    });

Comentarii.associate = (models) => {
    Comentarii.belongsTo(models.Plangeri, {
        foreignKey: 'id_plangere',
        as: 'plangere'
    });
};

module.exports = Comentarii;