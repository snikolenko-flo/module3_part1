import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import mongoose from 'mongoose';
import { LoginManager } from './login.manager';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DbService } from '../services/db-service';
import { IUser } from '../interfaces/user';
import { AuthService } from '../services/auth';

const secret = process.env.SECRET;
const mongoUrl = process.env.MONGO_URL;

export const login: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const manager = new LoginManager();
    const { email, password } = JSON.parse(event.body!);
    const dbService = new DbService();
    const authService = new AuthService();
    await mongoose.connect(mongoUrl!);

    const user: IUser = await manager.user.findUser(email, dbService);

    if (!user) return createResponse(401, { errorMessage: 'Email or password are invalid.' });
    log('The user exists.');

    const valid = await user.isValidPassword(password);
    if (!valid) return createResponse(401, { errorMessage: 'Email or password are invalid.' });
    log('The user email and password are valid.');

    const token = authService.createJWTToken(user, secret!);
    log('Token is created');
    return createResponse(200, { token });
  } catch (e) {
    return errorHandler(e);
  }
};
