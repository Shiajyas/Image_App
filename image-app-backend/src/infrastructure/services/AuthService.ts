import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { IAuthService } from "../../application/interfaces/services/IAuthService";
import { User } from "../../domain/entities/User";

export class AuthService implements IAuthService {
  private jwtSecret = process.env.JWT_SECRET || "supersecret";
  private jwtExpiresIn = process.env.JWT_EXPIRES_IN || "3d"; // Access token
  private jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "refreshsecret";
  private jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d"; // Refresh token

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Failed to hash password");
    }
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw new Error("Failed to compare passwords");
    }
  }

  async generateToken(user: User): Promise<string> {
    try {
      const payload = {
        id: user._id,
        email: user.email,
        phone: user.phone,
      };

       return jwt.sign(payload, this.jwtSecret, {
       expiresIn: this.jwtExpiresIn,
       algorithm: 'HS256', // Specify the algorithm if it's not the default one
    } as SignOptions);

    } catch (error) {
      console.error("Error generating token:", error);
      throw new Error("Token generation failed");
    }
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = {
        id: user._id,
        email: user.email,
        phone: user.phone,
      };

      const accessToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      }as SignOptions);

      const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, {
        expiresIn: this.jwtRefreshExpiresIn,
      }as SignOptions);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error generating tokens:", error);
      throw new Error("Token generation failed");
    }
  }
}
