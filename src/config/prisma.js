import { PrismaClient } from "@prisma/client";
import { logDatabaseQueries } from '../utils/database.logger.js';

export const prisma = new PrismaClient();

// Enable database query logging
logDatabaseQueries();
