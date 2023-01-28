import { opendir, stat } from 'node:fs/promises';
import { User } from './user.model.js';
import { Image } from './image.model.js';
import mongoose from 'mongoose';
import * as crypto from 'node:crypto';

export class DbService {
  private async isDirectory(filePath: string): Promise<boolean> {
    const isDir = await stat(filePath);
    return isDir.isDirectory();
  }

  async addImagesData(directory: string): Promise<void> {
    try {
      const dir = await opendir(directory);

      for await (const file of dir) {
        try {
          if (file.name.startsWith('.')) continue;

          const filePath = directory + '/' + file.name;
          const isDir = await this.isDirectory(filePath);

          if (isDir) {
            await this.addImagesData(filePath);
          } else {
            const fileStat = await stat(filePath);
            const path = directory + '/' + file.name;
            const isImage = await Image.findOne({ path: path }).exec();

            if (isImage) return;

            const date = new Date();
            const image = new Image({
              path: path,
              metadata: fileStat,
              date: date,
            });
            await image.save();
          }
        } catch (e) {
          console.log(`${e} | class: ${this.constructor.name} | function: addImagesData.`);
        }
      }
    } catch (e) {
      console.log(`${e} | class: ${this.constructor.name} | function: addImagesData.`);
    }
  }

  async addDefaultUsers(): Promise<void> {
    const defaultUsersArray = ['asergeev@flo.team', 'tpupkin@flo.team', 'vkotikov@flo.team'];

    try {
      const records = await User.find({ email: { $in: defaultUsersArray } });
      if (records.length) return;

      const asergeev = new User({
        email: 'asergeev@flo.team',
        password: 'jgF5tn4F',
        salt: crypto.randomBytes(16).toString('hex')
      });
      await asergeev.save();
      console.log(`The user ${asergeev.email} was saved to DB.`);

      const tpupkin = new User({
        email: 'tpupkin@flo.team',
        password: 'tpupkin@flo.team',
        salt: crypto.randomBytes(16).toString('hex')
      });
      await tpupkin.save();
      console.log(`The user ${tpupkin.email} was saved to DB.`);

      const vkotikov = new User({
        email: 'vkotikov@flo.team',
        password: 'po3FGas8',
        salt: crypto.randomBytes(16).toString('hex')
      });
      await vkotikov.save();
      console.log(`The user ${vkotikov.email} was saved to DB.`);
    } catch (e) {
      console.log(`${e} | class: ${this.constructor.name} | function: addDefaultUsers.`);
    }
  }

  private async connectToDb(mongoUrl: string): Promise<void> {
    try {
      await mongoose.connect(mongoUrl);
      console.log(`Database is running at ${mongoUrl}`);
    } catch (e) {
      console.log(`${e} | class: ${this.constructor.name} | function: connectToDb.`);
    }
  }

  private async addDefaultUsersToDB(): Promise<void> {
    try {
      await this.addDefaultUsers();
      console.log('Default users have been added to DB.');
    } catch (e) {
      console.log(`${e} | class: ${this.constructor.name} | function: addDefaultUsersToDB.`);
    }
  }

  private async addImagesDataToDB(imagesDir: string): Promise<void> {
    try {
      await this.addImagesData(imagesDir);
      console.log('Images have been added to DB.');
    } catch (e) {
      console.log(`${e} | class: ${this.constructor.name} | function: addImagesDataToDB.`);
    }
  }

  async startDb(imagesDir: string, mongoUrl: string): Promise<void> {
    await this.connectToDb(mongoUrl);
    await this.addDefaultUsersToDB();
    await this.addImagesDataToDB(imagesDir);
    process.exit();
  }
}