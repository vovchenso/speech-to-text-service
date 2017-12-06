import assert from 'assert';

export default ({ milliseconds, then } = {}) => {
  assert.ok(milliseconds, 'milliseconds is missing');
  assert.ok(then, 'then is missing');

  const delayed = {

    id: setTimeout(then, milliseconds),

    stop: () => {
      delayed.stopped = true;
      clearTimeout(delayed.id);

      return delayed;
    },

    reset: () => {
      if (!delayed.stopped) {
        clearTimeout(delayed.id);
        delayed.id = setTimeout(then, milliseconds);
      }

      return delayed;
    }
  };

  return delayed;
};