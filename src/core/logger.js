const logger = {

  info: (...args) => logger.log('log', ...args),

  error: (...args) => logger.log('error', ...args),

  log: (level, ...args) => console[level](new Date(), ...args)

};

export default logger;