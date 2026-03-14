

import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { envVars } from "../config/env.js";

export const checkAuthMiddleware =
  (...allowedRoles) =>
    async (req, res, next) => {
      console.log("🔥 Auth middleware hit:", req.originalUrl);

      try {
        let token = req.headers.authorization;

        if (!token) {
          return res.status(401).json({
            success: false,
            message: "No token provided",
          });
        }

        const jwtToken = token.replace(/^Bearer\s*/i, "");
        const decoded = jwt.verify(jwtToken, envVars.JWT_SECRET_TOKEN);

        // Determine which table to search based on the route
        const isMobileRequest = req.originalUrl.includes("/api/mobile/");
        let user = null;
        let userType = null;

        if (isMobileRequest) {
          user = await prisma.mobileUser.findUnique({
            where: { id: decoded.id },
          });
          userType = "mobile";
        } else {
          // Check regular User table first
          user = await prisma.user.findUnique({
            where: { id: decoded.id },
          });
          userType = "user";

          // Fallback to MobileUser if not found in User table for shared routes
          if (!user) {
            user = await prisma.mobileUser.findUnique({
              where: { id: decoded.id },
            });
            userType = "mobile";
          }
        }

        if (!user) {
          console.log(`❌ User NOT found in ${isMobileRequest ? 'MobileUser' : 'User'} table for ID: ${decoded.id}`);
          return res.status(401).json({
            success: false,
            message: "User not found",
          });
        }

        user.userType = userType;
        console.log(`✅ User found: ${user.email} (${user.role}), Type: ${user.userType}`);

        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
          return res.status(403).json({
            success: false,
            message: "Forbidden",
          });
        }

        const isResetRoute = req.originalUrl.includes("/reset-password");

        if (!user.isVerified && !isResetRoute) {
          return res.status(403).json({
            success: false,
            message: "User is not verified. Please verify your email.",
          });
        }

        req.user = user;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
    };
