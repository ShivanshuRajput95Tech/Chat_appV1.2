const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const mongoUri = process.env.DB;

    if (!mongoUri) {
      throw new Error("DB environment variable is missing");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`DB CONNECTED SUCCESSFULLY: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("COULD NOT CONNECT TO DB", error.message);
    process.exit(1);
  }
};
