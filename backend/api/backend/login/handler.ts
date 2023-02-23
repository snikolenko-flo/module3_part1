import { errorHandler } from '@helper/http-api/error-handler';
import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import mongoose from 'mongoose';
import { LoginManager } from './login.manager';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DbService } from '../services/db-service';

const secret = process.env.SECRET;
const mongoUrl = process.env.MONGO_URL;

export const login: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    /**
     * Create the manager object
     */
    const manager = new LoginManager();
    /**
     * Prepare required data
     */
    const { email, password } = JSON.parse(event.body!);
    /**
     * Prepare required services
     */
    const dbService = new DbService();
    await mongoose.connect(mongoUrl!);
    /**
     * Call the manager's method
     */
    const user = await manager.user.findUser(email, dbService);
    if (!user) return createResponse(401, { errorMessage: 'Email or password are invalid.' });
    log('The user exists.');

    const valid = await user.isValidPassword(password);
    if (!valid) return createResponse(401, { errorMessage: 'Email or password are invalid.' });
    log('The user email and password are valid.');

    const token = manager.response.createJWTToken(user, secret);
    log('Token is created');
    return createResponse(200, { token });
  } catch (e) {
    return errorHandler(e);
  }
};
