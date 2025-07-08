import consola, { type InputLogObject } from "consola";

class Logger {
  info(message: InputLogObject | any, ...args: any[]) {
    consola.info(message, ...args);
  }

  box(message: InputLogObject | any, ...args: any[]) {
    consola.box(message, ...args);
  }

  error(message: InputLogObject | any, ...args: any[]) {
    consola.error(message, ...args);
  }

  warn(message: InputLogObject | any, ...args: any[]) {
    consola.warn(message, ...args);
  }

  trace(message: InputLogObject | any, ...args: any[]) {
    consola.trace(message, ...args);
  }

  success(message: InputLogObject | any, ...args: any[]) {
    consola.success(message, ...args);
  }
}

declare global {
  var log: Logger;
}

export declare var logger: Logger;

const _logger = new Logger();
global.log = _logger;
export {};
