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

  async execute(dto: RegisterUserDTO): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const hashedPassword = await this.authService.hashPassword(dto.password);

    const user = new User(dto.email, dto.phone, hashedPassword, dto.avatar);

    const createdUser = await this.userRepo.create(user);

    const tokens = await this.authService.generateTokens(createdUser);

    return {
      user: createdUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
}
