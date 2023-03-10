import { IUser } from '../interfaces/user';
import { DbService } from '../services/db-service';

export class LoginUser {
  async findUser(email: string, dbService: DbService): Promise<IUser> {
    try {
      const user = await dbService.findUser(email);
      return user;
    } catch (e) {
      throw { errorMessage: 'Could not get a user from database.', statusCode: 404 };
    }
  }
}
