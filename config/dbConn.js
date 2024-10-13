const { Sequelize } = require('@sequelize/core');
const { SqliteDialect } = require('@sequelize/sqlite3');

// Initialize Sequelize instance with SQLite dialect and storage path
const sequelize = new Sequelize({
  dialect: 'sqlite', // Properly instantiate the SqliteDialect
  storage: './model/db.sqlite',  // Ensure correct path to the SQLite database file
});

// The old MongoDB connection code using Mongoose is commented out
// as you are transitioning from MongoDB to SQLite.

// const mongoose = require('mongoose');
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.DATABASE_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//     } catch (err) {
//         console.error(err);
//     }
// }

module.exports = sequelize;
