import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import bcrypt from 'bcryptjs';
import * as jwtUtils from '../../utils/jwt';

jest.mock('./auth.repository');
jest.mock('bcryptjs');
jest.mock('../../utils/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authRepository = new AuthRepository() as jest.Mocked<AuthRepository>;
    authService = new AuthService();
    (authService as any).authRepository = authRepository;
  });

  describe('register', () => {
    it('should throw an error if email already exists', async () => {
      const data = { email: 'test@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' };
      authRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

      await expect(authService.register(data)).rejects.toThrow('Email already exists');
    });

    it('should create a new user and return tokens', async () => {
      const data = { email: 'test@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' };
      authRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      authRepository.create.mockResolvedValue({ id: '1', email: data.email, role: 'TEAM_MEMBER' } as any);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');

      const result = await authService.register(data);

      expect(authRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: data.email,
        passwordHash: 'hashed_password',
      }));
      expect(result).toEqual({
        user: expect.objectContaining({ email: data.email }),
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });
  });
});
