import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
    level: isDev ? "debug" : process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: isDev ? {
        targets: [
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                },
                level: "debug"
            },
            {
                target: "pino/file",
                options: {
                    destination: "logs/app.log",
                    mkdir: true,
                },
                level: "warn"
            }

        ]

    } : undefined
}
)