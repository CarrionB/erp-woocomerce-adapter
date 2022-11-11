import pino from "pino";

const pinoLogger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

const logger = {
  info: (...argsToPrint: any[]) =>{
    argsToPrint.forEach((entry)=> {
      pinoLogger.info(entry);
    });
  },
  error: (...argsToPrint: any[]) =>{
    argsToPrint.forEach((entry)=> {
      pinoLogger.error(entry);
    });
  }
}

export default logger;
