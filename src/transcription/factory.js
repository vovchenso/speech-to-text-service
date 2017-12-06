import Speech from '@google-cloud/speech';
import { Writable } from 'stream';
import streamifier from 'streamifier';
import assert from 'assert';
import { mandatory, getEnvVar, tryToGetEnvVar } from '../core/env';
import delay from '../core/delay';
import logger from '../core/logger';

mandatory('GOOGLE_APPLICATION_CREDENTIALS');

const MAX_INACTIVITY = tryToGetEnvVar('MAX_INACTIVITY') || 12000; // 4 seconds
const DELAY_UNTIL_THE_END = tryToGetEnvVar('DELAY_UNTIL_THE_END') || 800; // 0.8 seconds

const DO_NOT_END_THE_STREAM_WRITER = false;

const createDummyStream = () => new Writable();

export const createTranscription = () => {
  const transcription = {};

  transcription.stream = createDummyStream();

  transcription.init = ({ config = {}, onReady, onText, onEndUtterance, onEnd } = {}) => {
    assert.ok(config.encoding, 'Missing field : config.encoding');
    assert.ok(config.sampleRate, 'Missing field : config.sampleRate');
    assert.ok(config.language, 'Missing field : config.language');

    const options = {
      config: {
        encoding: config.encoding,
        sampleRateHertz: config.sampleRate,
        languageCode: config.language
      },
      interimResults: true,
      singleUtterance: true
    };

    transcription.preventInactivity = delay({
        milliseconds: MAX_INACTIVITY,
        then: onEnd
    });

    transcription.stream = Speech()
      .createRecognizeStream(options)
      .on('error', logger.error)
      .on('data', ({ speechEventType, results: text }) => {
        transcription.preventInactivity.stop();
        if (speechEventType === 'END_OF_SINGLE_UTTERANCE') {
          onEndUtterance();
          delay({ milliseconds: DELAY_UNTIL_THE_END, then: () => onEnd(transcription.lastText || '') });
        } else {
          transcription.lastText = text;
          onText(text);
        }
      });

    onReady();
  };

  transcription.process = (data) => {
    assert.ok(data, 'data is mandatory');
    assert.ok(transcription.stream, 'stream is mandatory. Please init the transcription object before to process data');

    const input = streamifier.createReadStream(data);
    const output = transcription.stream;

    input.pipe(output, { end: DO_NOT_END_THE_STREAM_WRITER });
  };

  transcription.close = () => {
    transcription.stream.end();
    transcription.stream = createDummyStream();
  };

  return transcription;
};
