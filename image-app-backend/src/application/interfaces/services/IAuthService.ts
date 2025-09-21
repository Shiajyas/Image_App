import { RegisterUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { User } from "../../../domain/entities/User";

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(password: string, hash: string): Promise<boolean>;
  generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }>;
  generateToken(user: User): Promise<string>;
}
