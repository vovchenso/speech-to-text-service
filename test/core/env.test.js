import { mandatory, getEnvVar, tryToGetEnvVar } from '../../src/core/env';

describe('Core / Environment Variables', () => {

  process.env.EXISTING_ENV_VAR = 'expecting-value';

  describe('Get value', () => {
    it('Existing variable', () => {
      // when / then
      expect(getEnvVar('EXISTING_ENV_VAR')).toEqual('expecting-value');
    });

    it('Unknown variable', () => {
      // when / then
      expect(() => getEnvVar('UNKNOWN')).toThrow();
    });
  });

  describe('Try to get value', () => {
    it('Existing variable', () => {
      // when / then
      expect(tryToGetEnvVar('EXISTING_ENV_VAR')).toEqual('expecting-value');
    });

    it('Unknown variable', () => {
      // when / then
      expect(tryToGetEnvVar('UNKNOWN')).toBeUndefined();
    });
  });

  describe('Mandatory', () => {
    it('Existing variable', () => {
      // when / then
      mandatory('EXISTING_ENV_VAR'); // do not throw anything
    });

    it('Missing variable', () => {
      // when / then
      expect(() => mandatory('UNKNOWN')).toThrow();
    });
  });

});

