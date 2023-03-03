import { createResponse } from '@helper/http-api/response';
import { log } from '@helper/logger';
import { GalleryFile } from './gallery.file.js';
import { DbService } from '../services/db-service';

export class GalleryManager {
  file: GalleryFile;

  constructor() {
    this.file = new GalleryFile();
  }

  async getGallery(user: string, pageNumber: number, pageLimit: number, dbService: DbService) {
    let pagesAmount;
    if (user) {
      const userImagesNumber = await dbService.getUserImagesNumber(user, pageLimit);
      pagesAmount = this.file.getNumberOfPagesForUser(userImagesNumber);
    } else {
      pagesAmount = await this.file.getNumberOfPages(pageLimit);
    }

    if (pageNumber > pagesAmount || pageNumber <= 0) {
      log(`The page number ${pageNumber} is wrong.`);
      return createResponse(400, {
        message: `Page should be Greater than 0 and less than ${pagesAmount + 1}`,
      });
    }

    if (user) {
      log(`A user ${user} was specified.`);
      const images = await dbService.getUserImages(pageNumber, pageLimit, pagesAmount, user);
      log(`Got images for the user ${user}.`);
      return createResponse(200, images);
    } else {
      const images = await dbService.getImages(pageNumber, pageLimit, pagesAmount);
      return createResponse(200, images);
    }
  }
}
