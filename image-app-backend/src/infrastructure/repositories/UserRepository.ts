import { IUserRepository } from "../../application/interfaces/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import UserModel from "../database/models/user.model";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    
    try {
      const created = await UserModel.create(user);
      console.log(created,"sussess");
      return new User(
        created.email,
        created.phone,
        created.password,
        created.avatar ?? undefined,
        created._id.toString()
      );
    } catch (error) {
      console.error("UserRepository.create() error:", error);
      throw new Error("Failed to create user.");
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email }).lean();
      if (!user) return null;

      return new User(
        user.email,
        user.phone,
        user.password,
        user.avatar ?? undefined,
        user._id.toString()
      );
    } catch (error) {
      console.error("UserRepository.findByEmail() error:", error);
      throw new Error("Failed to find user by email.");
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ phone }).lean();
      if (!user) return null;

      return new User(
        user.email,
        user.phone,
        user.password,
        user.avatar ?? undefined,
        user._id.toString()
      );
    } catch (error) {
      console.error("UserRepository.findByPhone() error:", error);
      throw new Error("Failed to find user by phone.");
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id).lean();
      if (!user) return null;

      return new User(
        user.email,
        user.phone,
        user.password,
        user.avatar ?? undefined,
        user._id.toString()
      );
    } catch (error) {
      console.error("UserRepository.findById() error:", error);
      throw new Error("Failed to find user by ID.");
    }
  }

 async update(user: User): Promise<User | null> {
  try {
    const updated = await UserModel.findByIdAndUpdate(user._id, user, { new: true }).lean();

    if (!updated) return null;

    return new User(
      updated.email,
      updated.phone,
      updated.password,
      updated.avatar ?? undefined,
      updated._id.toString()
    );
  } catch (error) {
    console.error("UserRepository.update() error:", error);
    throw new Error("Failed to update user.");
  }
 }


}
