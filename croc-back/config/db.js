const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'crocoanonim',    // Database name
  'root',           // Database user
  '',           // Database password
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false
    },
    logging: false,
    // If you are not planning to run with production SSL, you can remove or set this option to false:
    dialectOptions: { 
      ssl: false
    }
  }
);

sequelize.authenticate()
  .then(async () => {
    console.log('Connection has been established successfully.');
    const [results] = await sequelize.query("SELECT VERSION()");
    console.log('Database version:', results[0]['VERSION()']);
  })
  .catch(err => console.error('Unable to connect to the database:', err));

// In your sync function
async function syncModels() {
    try {
        await sequelize.sync({ force: false }); // Set force to true only for development/testing
        console.log('Database synced!');
    } catch (error) {
        console.error('Sync error:', error);
    }
}

syncModels();

module.exports = sequelize;
