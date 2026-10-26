import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp(config);

const server = app.listen(config.PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎬 Bioscope AI — Pay Per Insight Server is running!`);
  console.log(`📡 Listening on: http://localhost:${config.PORT}`);
  console.log(`🔒 Payment Mode: ${config.PAYMENT_MODE.toUpperCase()}${config.PAYMENT_MODE === 'mock' ? ' (SIMULATED PAYMENT — NO FUNDS TRANSFERRED)' : ' (REAL BASE SEPOLIA SETTLEMENT)'}`);
  console.log(`🌐 Facilitator: ${config.X402_FACILITATOR_URL}`);
  console.log(`⛓️  Network: ${config.X402_NETWORK}`);
  console.log(`👛 Recipient: ${config.PAYMENT_RECIPIENT_ADDRESS}`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
