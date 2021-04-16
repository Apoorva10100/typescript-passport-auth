import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables")
    dotenv.config({ path: ".env" })
}

export const ENVIRONMENT = process.env.NODE_ENV

export const MONGODB_URI =  process.env.MONGODB_URI

export const JWT_SECRET = "ashdfjhasdlkjfhalksdjhfla";

export const REFRESH_SECRET = "qwertyuioplkjhgdsazxcvbnm";

if (! MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}

if (! JWT_SECRET) {
    logger.error("No JWT secret string. Set JWT_SECRET environment variable.");
    process.exit(1);
}

if (! REFRESH_SECRET) {
    logger.error("No JWT secret string. Set JWT_SECRET environment variable.");
    process.exit(1);
}
