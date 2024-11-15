const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config({ path: "./config.env" });
const app = require("../src/app")



// Initialize Prisma Client
const prisma = new PrismaClient();

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to database and start the server
async function main() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("DB connection successful");

    // Start the server
    const port = process.env.PORT || 8000;
    const server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });

    // Handle Unhandled Promise Rejections
    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION! 💥 Shutting down...");
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Gracefully disconnect Prisma on exit
    process.on("SIGTERM", async () => {
      console.log("SIGTERM RECEIVED. Shutting down gracefully...");
      await prisma.$disconnect();
      server.close(() => {
        console.log("💥 Process terminated!");
      });
    });
  } catch (error) {
    console.error("Error starting application:", error);
    process.exit(1);
  }
}

// Call the main function to start the server
main();
