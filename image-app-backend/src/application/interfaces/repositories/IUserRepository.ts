import { User } from "../../../domain/entities/User";

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<User | null>;
  
}
