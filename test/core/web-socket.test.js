import { ALLOW_CONNECTION, REFUSE_CONNECTION, UNAUTHORIZED_HTTP_CODE } from '../../src/core/web-socket';
import { validateConnection, parseWSEvent } from '../../src/core/web-socket';

describe('Core / Web Socket', () => {

  describe('Validate connection', () => {

    const usingURL = url => ({ req: { url } });

    it('Default behaviour, should always accept connections', () => {
      // when
      const callback = jest.fn();
      validateConnection('default-security-mode', usingURL('/'), callback);

      // then
      expect(callback).toHaveBeenCalledWith(ALLOW_CONNECTION);
    });

    it('Security enabled and token is present, should allow connections', () => {
      // when
      const callback = jest.fn();
      validateConnection('oauth', usingURL('/?access_token=TOKEN'), callback);

      // then
      expect(callback).toHaveBeenCalledWith(ALLOW_CONNECTION);
    });

    it('Security enabled and no token, should refuse connections', () => {
      // when
      const callback = jest.fn();
      validateConnection('oauth', usingURL('/'), callback);

      // then
      expect(callback).toHaveBeenCalledWith(REFUSE_CONNECTION, UNAUTHORIZED_HTTP_CODE, expect.any(String));
    });
  });

  describe('Parse event', () => {

    describe('JSON', () => {
      it('String which can be parsed as a JSON', () => {
        // when / then
        expect(parseWSEvent('{"type":"start","field":"value"}')).toEqual({
          binary: false, type: 'start', field: 'value'
        });
      });

      it('String which is not JSON', () => {
        // when / then
        expect(parseWSEvent('CANNOT-BE-PARSED')).toEqual({
          binary: false
        });
      });
    });

    it('Binary', () => {
      // when / then
      expect(parseWSEvent('DATA', { binary: true })).toEqual({
        binary: true, data: 'DATA'
      });
    });
  });

});

