// config/associations.js
const Plangeri = require('../Models/PLANGERII');
const Comentarii = require('../Models/Comentarii');

const setupAssociations = () => {
  // Define associations in both directions
  Plangeri.hasMany(Comentarii, {
    foreignKey: 'id_plangere',
    as: 'comentarii'
  });

  Comentarii.belongsTo(Plangeri, {
    foreignKey: 'id_plangere',
    as: 'plangere'
  });
};

module.exports = setupAssociations;