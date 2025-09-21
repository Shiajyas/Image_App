import { injectable, inject } from "tsyringe";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { ResetPasswordDTO } from "../../interfaces/dtos/user.dto";
import { User } from "../../../domain/entities/User";


@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("AuthService") private authService: IAuthService
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<User> {
    // 1️ Find user by ID (or email)
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 2️ Hash the new password
    const hashedPassword = await this.authService.hashPassword(dto.newPassword);

    // 3️ Update user entity
    user.password = hashedPassword;

    // 4️ Save updated user
    const updatedUser = await this.userRepository.update(user);

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return updatedUser;
  }
}