import winston from 'winston'

export function createLogger(label: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] [${label}] ${level}: ${message}`
      })
    ),
    transports: [new winston.transports.Console()]
  })
}
