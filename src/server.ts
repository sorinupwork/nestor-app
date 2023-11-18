import http from 'http';

import app from './app';

const PORT = process.env.APP_PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
