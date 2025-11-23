import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { RegisterUserDTO } from "../../interfaces/dtos/user.dto";
import { User } from "../../../domain/entities/User";

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject("UserRepository") private userRepo: IUserRepository,
    @inject("AuthService") private authService: IAuthService
  ) {}

  async execute(dto: RegisterUserDTO) {
    // 1. Duplicate Checks
    const existingEmail = await this.userRepo.findByEmail(dto.email);
    if (existingEmail) {
       console.log("email alredy taken");
      throw new Error("Email already registered");
    }

    const existingUsername = await this.userRepo.findByUsername(dto.username);
    if (existingUsername) {
     
      
      throw new Error("Username already taken");
    }

    // 2. Hash Password
    const hashedPassword = await this.authService.hashPassword(dto.password);

    // 3. Create User Entity
    const user = new User(
      dto.email,
      dto.username,
      dto.phone || "",
      hashedPassword,
      dto.avatar
    );

    // 4. Save User
    const createdUser = await this.userRepo.create(user);

    // 5. Generate Tokens
    const tokens = await this.authService.generateTokens(createdUser);

    // 6. Remove Password Before Returning
    const { password, ...safeUser } = createdUser;

    return {
      user: safeUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
}
