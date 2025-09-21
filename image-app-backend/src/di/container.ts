import { container } from "tsyringe";

// Interfaces
import { IUserRepository } from "../application/interfaces/repositories/IUserRepository";
import { IImageRepository } from "../application/interfaces/repositories/IImageRepository";
import { IAuthService } from "../application/interfaces/services/IAuthService";
import { IFileStorageService } from "../application/interfaces/services/IFileStorageService";

// Implementations
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { ImageRepository } from "../infrastructure/repositories/ImageRepository";
import { AuthService } from "../infrastructure/services/AuthService";
import { FileStorageService } from "../infrastructure/services/FileStorageService";

// Bind interfaces to implementationsd
container.register<IUserRepository>("UserRepository", { useClass: UserRepository });    
container.register<IImageRepository>("ImageRepository", { useClass: ImageRepository });
container.register<IAuthService>("AuthService", { useClass: AuthService });
container.register<IFileStorageService>("FileStorageService", { useClass: FileStorageService });

export { container };
