import assert from 'assert';

export const tryToGetEnvVar = key => process.env[key];

export const getEnvVar = key => {
  const value = tryToGetEnvVar(key);

  assert.ok(value, `Missing environment variable : ${key}`);
  return value;
};

export const mandatory = getEnvVar; // alias
