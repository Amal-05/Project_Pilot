import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { RegisterInput, LoginInput, ForgotPasswordInput } from '@project-pilot/validation';
import { EmailService } from '../../services/email.service';

export class AuthService {
  private authRepository: AuthRepository;
  private emailService: EmailService;

  constructor(authRepository?: AuthRepository, emailService?: EmailService) {
    this.authRepository = authRepository || new AuthRepository();
    this.emailService = emailService || new EmailService();
  }

  async register(data: RegisterInput) {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      const error = new Error('Email already exists');
      (error as any).statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.authRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput) {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      const error = new Error('Invalid credentials');
      (error as any).statusCode = 401;
      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordMatch) {
      const error = new Error('Invalid credentials');
      (error as any).statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await this.authRepository.findById(decoded.userId);
      
      if (!user) throw new Error('User not found');

      const accessToken = generateAccessToken(user.id, user.role);
      return { accessToken };
    } catch (error) {
      const err = new Error('Invalid refresh token');
      (err as any).statusCode = 401;
      throw err;
    }
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    const user = await this.authRepository.findByEmail('mock@example.com'); 
    if (!user) {
      const error = new Error('Invalid or expired reset token');
      (error as any).statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);
    await this.authRepository.update(user.id, { passwordHash });

    return { message: 'Password has been reset successfully' };
  }

  async googleSignIn(data: { token: string }) {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${data.token}`);
    if (!response.ok) {
      const error = new Error('Invalid Google Token');
      (error as any).statusCode = 400;
      throw error;
    }
    const payload = (await response.json()) as any;

    if (!payload.email) {
      const error = new Error('Invalid Google Token payload: email missing');
      (error as any).statusCode = 400;
      throw error;
    }

    const email = payload.email;
    const googleId = payload.sub;
    const firstName = payload.given_name || 'Google';
    const lastName = payload.family_name || 'User';
    const avatarUrl = payload.picture;

    let user = await this.authRepository.findByEmail(email);
    if (user) {
      if (!user.googleId) {
        user = await this.authRepository.update(user.id, {
          googleId,
          avatarUrl: avatarUrl || user.avatarUrl,
          isEmailVerified: true
        });
      }
    } else {
      user = await this.authRepository.create({
        email,
        firstName,
        lastName,
        googleId,
        avatarUrl,
        isEmailVerified: true,
      });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      accessToken,
      refreshToken,
    };
  }
}
