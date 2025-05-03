import dotenv from 'dotenv';
import { App } from './app';
import { prisma } from './config';

// Cargar variables de entorno
dotenv.config();

async function startServer() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('Database connection established');

    // Iniciar servidor
    const app = new App();
    app.run();
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();