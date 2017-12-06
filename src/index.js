import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { tryToGetEnvVar } from './core/env';
import { validateConnection, parseWSEvent } from './core/web-socket';
import logger from './core/logger';
import { createTranscription } from './transcription/factory';

const PORT = tryToGetEnvVar('PORT') || 8080;
const SECURITY_MODE = tryToGetEnvVar('SECURITY_MODE') || 'none';
const SERVER_PATH = tryToGetEnvVar('SERVER_PATH') || '';

const app = express();

app.get(`${SERVER_PATH}/status`, (request, response) => {
  response.send({ status: 'OK' });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
  verifyClient: (info, callback) => validateConnection(SECURITY_MODE, info, callback)
});

wss.on('connection', ws => {

  const transcription = createTranscription();

  ws.on('message', (event, flags) => {
    try {
      const message = parseWSEvent(event, flags);
      message.binary ? ws.onBinaryMessage(message) : ws.onJsonMessage(message);
    } catch (error) {
      ws.handleError('WebSocket: error during message processing', error);
    }
  });

  ws.sendJson = object => {
    logger.info('WebSocket: send json', object);
    ws.send(JSON.stringify(object));
  };

  ws.onJsonMessage = message => {
    switch (message.type) {

      case 'start':
        return transcription.init({
          config: message.config,
          onReady: () => ws.sendJson({ type: 'ready' }),
          onText: (text) => ws.sendJson({ type: 'text', text }),
          onEndUtterance: () => ws.sendJson({ type: 'end-of-utterance' }),
          onEnd: (text) => ws.sendJson({ type: 'end', text }) & ws.close()
        });
    }
  };

  ws.onBinaryMessage = message => {
    transcription.process(message.data);
  };

  ws.on('close', () => {
    logger.info('WebSocket: close');
    transcription.close();
  });

  ws.on('error', error => ws.handleError('WebSocket: error', error));

  ws.handleError = (description, error) => {
    logger.error(description, error);
    ws.sendJson({ type: 'error', error });
  }
});

const listener = server.listen(PORT, () => {
  logger.info(`Listening on port ${listener.address().port}, security=${SECURITY_MODE}, path=${SERVER_PATH}`);
});
