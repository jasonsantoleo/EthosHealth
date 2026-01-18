// server/index.ts
import express7 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// server/database.ts
import mongoose from "mongoose";
var MONGODB_URI = "mongodb+srv://cherancaiml2023_db_user:aj1seven@cluster0.sg2mmoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("\u2705 Connected to MongoDB successfully");
  } catch (error) {
    console.error("\u274C MongoDB connection error:", error);
    process.exit(1);
  }
}
var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: false },
  // Add password field
  avatar: String,
  provider: { type: String, enum: ["google", "facebook", "apple", "email"], required: true },
  providerId: String,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
});
var coinbaseWalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  walletAddress: { type: String, required: true, unique: true },
  walletName: { type: String, default: "Coinbase Wallet" },
  isActive: { type: Boolean, default: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});
var healthIdSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coinbaseWalletId: { type: mongoose.Schema.Types.ObjectId, ref: "CoinbaseWallet", required: true },
  patientName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  bloodGroup: String,
  gender: String,
  medicalConditions: String,
  emergencyContact: String,
  status: { type: String, enum: ["active", "suspended", "expired"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
var healthSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverage: { type: Number, required: true },
  processingTime: { type: String, required: true },
  networkHospitals: { type: Number, required: true },
  matchPercentage: { type: Number, required: true },
  type: { type: String, enum: ["diabetes-care", "general-health", "family-care", "emergency-care"], required: true }
});
var voucherSchema = new mongoose.Schema({
  healthIdId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthId", required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthScheme", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["active", "claimed", "expired"], default: "active" },
  validUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});
var transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher", required: true },
  hospitalName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  transactionId: { type: String, required: true, unique: true },
  coinbaseWalletId: { type: mongoose.Schema.Types.ObjectId, ref: "CoinbaseWallet", required: true },
  createdAt: { type: Date, default: Date.now }
});
var aiRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  healthIdId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthId", required: true },
  recommendations: [{
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthScheme" },
    matchPercentage: { type: Number, required: true },
    reasoning: { type: String, required: true }
  }],
  eligibilityScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ["low", "medium", "high"], required: true },
  createdAt: { type: Date, default: Date.now }
});
var userActionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});
var UserModel = mongoose.model("User", userSchema);
var CoinbaseWalletModel = mongoose.model("CoinbaseWallet", coinbaseWalletSchema);
var HealthIdModel = mongoose.model("HealthId", healthIdSchema);
var HealthSchemeModel = mongoose.model("HealthScheme", healthSchemeSchema);
var VoucherModel = mongoose.model("Voucher", voucherSchema);
var TransactionModel = mongoose.model("Transaction", transactionSchema);
var AiRecommendationModel = mongoose.model("AiRecommendation", aiRecommendationSchema);
var UserActionLogModel = mongoose.model("UserActionLog", userActionLogSchema);
async function logUserAction(userId, action, details, ipAddress, userAgent) {
  try {
    await UserActionLogModel.create({
      userId,
      action,
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error("Error logging user action:", error);
  }
}

// server/auth.ts
var router = express.Router();
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
router.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({
      email,
      name,
      provider: "email",
      password: hashedPassword
    });
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    await logUserAction(user._id.toString(), "user_signup", { email, name }, req.ip, req.get("User-Agent"));
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    await UserModel.findByIdAndUpdate(user._id, { lastLoginAt: /* @__PURE__ */ new Date() });
    await logUserAction(user._id.toString(), "user_signin", { email }, req.ip, req.get("User-Agent"));
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/social-login", async (req, res) => {
  try {
    const { email, name, provider, providerId, avatar } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        email,
        name,
        provider,
        providerId,
        avatar,
        isVerified: true
        // Social login users are considered verified
      });
      await logUserAction(user._id.toString(), "user_social_signup", { email, name, provider }, req.ip, req.get("User-Agent"));
    } else {
      await UserModel.findByIdAndUpdate(user._id, {
        lastLoginAt: /* @__PURE__ */ new Date(),
        avatar: avatar || user.avatar
      });
      await logUserAction(user._id.toString(), "user_social_signin", { email, name, provider }, req.ip, req.get("User-Agent"));
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      message: "Social login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Social login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
var authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
var auth_default = router;

// server/wallet.ts
import express2 from "express";
var router2 = express2.Router();
router2.get("/balance", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await CoinbaseWalletModel.findOne({ userId });
    if (!wallet) {
      return res.json({ balance: 0 });
    }
    res.json({ balance: wallet.balance || 0 });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router2.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await CoinbaseWalletModel.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json({
      wallet: {
        id: wallet._id,
        walletAddress: wallet.walletAddress,
        walletName: wallet.walletName,
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive
      }
    });
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
var wallet_default = router2;

// server/vouchers.ts
import express3 from "express";
var router3 = express3.Router();
router3.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const healthId = await HealthIdModel.findOne({ userId });
    if (!healthId) {
      return res.json({ vouchers: [] });
    }
    const vouchers = await VoucherModel.find({
      healthIdId: healthId._id,
      status: "active"
      // Only active vouchers
    }).populate("schemeId");
    const transformedVouchers = vouchers.map((voucher) => {
      const scheme = voucher.schemeId;
      return {
        id: voucher._id.toString(),
        name: scheme?.name || "Unknown Scheme",
        description: scheme?.description || "Health scheme voucher",
        amount: voucher.amount,
        type: scheme?.type || "general-health",
        validUntil: voucher.validUntil.toDateString(),
        icon: "Heart",
        // Default icon, can be enhanced later
        color: "border-medilinkx-green text-medilinkx-green"
        // Default color
      };
    });
    res.json({ vouchers: transformedVouchers });
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router3.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { schemeId, amount, validUntil } = req.body;
    if (!schemeId || !amount || !validUntil) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const healthId = await HealthIdModel.findOne({ userId });
    if (!healthId) {
      return res.status(404).json({ message: "Health ID not found" });
    }
    const scheme = await HealthSchemeModel.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: "Health scheme not found" });
    }
    const voucher = await VoucherModel.create({
      healthIdId: healthId._id,
      schemeId,
      amount,
      status: "active",
      validUntil: new Date(validUntil)
    });
    res.status(201).json({
      message: "Voucher created successfully",
      voucher: {
        id: voucher._id,
        amount: voucher.amount,
        status: voucher.status,
        validUntil: voucher.validUntil
      }
    });
  } catch (error) {
    console.error("Error creating voucher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
var vouchers_default = router3;

// server/transactions.ts
import express4 from "express";
var router4 = express4.Router();
router4.get("/count", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await TransactionModel.countDocuments({ userId });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching transaction count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router4.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { voucherId, hospitalName, amount } = req.body;
    if (!voucherId || !hospitalName || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const healthId = await HealthIdModel.findOne({ userId });
    if (!healthId) {
      return res.status(404).json({ message: "Health ID not found" });
    }
    const voucher = await VoucherModel.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    if (voucher.healthIdId.toString() !== healthId._id.toString()) {
      return res.status(403).json({ message: "Voucher does not belong to user" });
    }
    if (voucher.status !== "active") {
      return res.status(400).json({ message: "Voucher is not active" });
    }
    const transactionId = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const transaction = await TransactionModel.create({
      userId,
      voucherId,
      hospitalName,
      amount,
      status: "completed",
      transactionId,
      coinbaseWalletId: healthId.coinbaseWalletId
      // This should be populated when wallet is created
    });
    await VoucherModel.findByIdAndUpdate(voucherId, { status: "claimed" });
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: {
        id: transaction._id,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        hospitalName: transaction.hospitalName,
        status: transaction.status
      }
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router4.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await TransactionModel.find({ userId }).sort({ createdAt: -1 }).limit(10);
    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
var transactions_default = router4;

// server/ai.ts
import express5 from "express";
var router5 = express5.Router();
router5.post("/recommendations", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { healthId, medicalConditions, age } = req.body;
    const schemes = await HealthSchemeModel.find({});
    const recommendations = schemes.map((scheme) => {
      let matchPercentage = 70;
      let reasoning = "General health coverage suitable for most users.";
      if (medicalConditions) {
        const conditions = medicalConditions.toLowerCase();
        if (scheme.type === "diabetes-care" && conditions.includes("diabetes")) {
          matchPercentage = 95;
          reasoning = "Perfect match for diabetes management based on your medical conditions.";
        } else if (scheme.type === "emergency-care" && (conditions.includes("heart") || conditions.includes("asthma"))) {
          matchPercentage = 90;
          reasoning = "High priority coverage recommended due to your medical conditions.";
        } else if (scheme.type === "family-care" && age > 30) {
          matchPercentage = 85;
          reasoning = "Family care package ideal for your age group and family planning needs.";
        }
      }
      if (age > 50 && scheme.type === "general-health") {
        matchPercentage += 10;
        reasoning += " Enhanced coverage recommended for your age group.";
      }
      return {
        id: scheme._id.toString(),
        name: scheme.name,
        description: scheme.description,
        coverage: scheme.coverage,
        processingTime: scheme.processingTime,
        networkHospitals: scheme.networkHospitals,
        matchPercentage: Math.min(matchPercentage, 100),
        reasoning,
        type: scheme.type
      };
    });
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    await AiRecommendationModel.create({
      userId,
      healthIdId: healthId,
      recommendations: recommendations.map((rec) => ({
        schemeId: rec.id,
        matchPercentage: rec.matchPercentage,
        reasoning: rec.reasoning
      })),
      eligibilityScore: recommendations[0]?.matchPercentage || 70,
      riskLevel: age > 50 ? "medium" : "low"
    });
    res.json({
      message: "AI recommendations generated successfully",
      recommendations: recommendations.slice(0, 5)
      // Return top 5 recommendations
    });
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
var ai_default = router5;

// server/routes.ts
async function registerRoutes(app2) {
  app2.use("/api/auth", auth_default);
  app2.use("/api/wallet", wallet_default);
  app2.use("/api/vouchers", vouchers_default);
  app2.use("/api/transactions", transactions_default);
  app2.use("/api/ai", ai_default);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express6 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express6.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express7();
app.use(express7.json());
app.use(express7.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  await connectDB();
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "localhost"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
