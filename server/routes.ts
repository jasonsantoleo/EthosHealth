import { Express } from "express";
import { createServer, Server } from "http";
import { connectToMongoDB } from "./mongodb.js";
import walletRoutes from "./routes/wallet.js";
import x402Routes from "./routes/x402.js";
import schemesRoutes from "./routes/schemes.js";
import hospitalsRoutes from "./routes/hospitals.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB (optional - app will work without it)
  const dbConnected = await connectToMongoDB();
  
  if (!dbConnected) {
    console.log('📝 Running in offline mode - using localStorage/mock data');
  }

  // Register API routes
  app.use('/api/wallet', walletRoutes);
  app.use('/api/x402', x402Routes);
  app.use('/api/schemes', schemesRoutes);
  app.use('/api/hospitals', hospitalsRoutes);

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
