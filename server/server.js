const http = require('http');
const app = require('./src/app');
const { connectDatabase } = require('./src/config/database');
const { env } = require('./src/config/env');
const { createSocketServer } = require('./src/sockets');

async function bootstrap() {
  await connectDatabase();

  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, () => {
    console.log(`RTC signaling server listening on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start RTC signaling server', error);
  process.exit(1);
});
