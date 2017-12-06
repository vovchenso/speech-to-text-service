import queryString from 'query-string';

export const ALLOW_CONNECTION = true;
export const REFUSE_CONNECTION = false;
export const UNAUTHORIZED_HTTP_CODE = 401;

const findParameters = info => {
  const url = info.req.url;

  const [, parameters] = url.split('?');
  return queryString.parse(parameters);
};

export const validateConnection = (security, info, callback) => {
  if (security !== 'oauth') return callback(ALLOW_CONNECTION);

  const parameters = findParameters(info);

  if (parameters['access_token']) {
    // TODO Parse the token and check if it is valid
    callback(ALLOW_CONNECTION)
  } else {
    callback(REFUSE_CONNECTION, UNAUTHORIZED_HTTP_CODE, 'access_token is missing');
  }
};

const parseStringEventIntoMessage = (string) => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return {};
  }
};

export const parseWSEvent = (event, { binary = false } = {}) => {
  if (binary) {
    return { binary, data: event };
  } else {
    return { binary, ...parseStringEventIntoMessage(event) };
  }
};