import delay from '../../src/core/delay';

jest.useFakeTimers();

describe('Core / Delay', () => {

  const DELAY_IN_MILLISECONDS = 1000;

  describe('Missing arguments', () => {
    it('No option', () => expect(() => delay()).toThrow());
    it('milliseconds is missing', () => expect(() => delay({ then: 'anything' })).toThrow());
    it('then is missing', () => expect(() => delay({ milliseconds: 'anything' })).toThrow());
  });

  describe('Delayed callback', () => {


    it('Delay, should trigger the callback later on', () => {
      // given
      const callback = jest.fn();

      // when
      delay({ milliseconds: DELAY_IN_MILLISECONDS, then: callback });

      // then
      expect(callback).not.toBeCalled();
      jest.runAllTimers();
      expect(callback).toBeCalled();
    });

    it('Stop, should NOT trigger the callback', () => {
      // given
      const callback = jest.fn();

      // when
      const delayed = delay({ milliseconds: DELAY_IN_MILLISECONDS, then: callback });
      delayed.stop();

      // then
      expect(callback).not.toBeCalled();
      jest.runAllTimers();
      expect(callback).not.toBeCalled();
    });

    it('Reset, should postpone the callback', () => {
      // given
      const callback = jest.fn();

      // when
      const delayed = delay({ milliseconds: DELAY_IN_MILLISECONDS, then: callback });
      delayed.reset();

      // then
      expect(callback).not.toBeCalled();
      jest.runAllTimers();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Stop & reset, should not re-start the delay', () => {
      // given
      const callback = jest.fn();

      // when
      const delayed = delay({ milliseconds: DELAY_IN_MILLISECONDS, then: callback });
      delayed.stop();
      delayed.reset();

      // then
      expect(callback).not.toBeCalled();
      jest.runAllTimers();
      expect(callback).not.toBeCalled();
    });

  });

});

