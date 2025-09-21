import { inject, injectable } from "tsyringe";
import { LoginUserDTO } from "../../interfaces/dtos/user.dto";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";

@injectable()
export class LoginUserUseCase {
  constructor(
    @inject("UserRepository") private userRepo: IUserRepository,
    @inject("AuthService") private authService: IAuthService
  ) {}

  async execute(dto: LoginUserDTO) {
    console.log("LoginUserUseCase execute", dto);

    try {
      const user = await this.userRepo.findByEmail(dto.email);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await this.authService.comparePasswords(
        dto.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const tokens = await this.authService.generateTokens(user);

      return {
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
        },
        ...tokens,
      };
    } catch (error) {
      console.error("LoginUserUseCase error:", error);
      throw new Error("Login failed");
    }
  }
}
