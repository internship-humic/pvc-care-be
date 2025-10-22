import BaseService from "../../common/base_classes/base-service.js";
import { hashPassword } from "../../utils/auth.util.js";
import fs from "fs";
import logger from "../../utils/logger.util.js";
import path from "path";

class ProfileService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getProfile(user_id, role) {
    let data;
    if (role === "FARMER") {
      data = await this.db.farmer.findUnique({
        where: { id: user_id },
      });
    } else if (role === "CUSTOMER") {
      data = await this.db.customer.findUnique({
        where: { id: user_id },
      });
    }

    delete data.password;
    return data;
  }

  async updateProfile(info, user_id, role) {
    const ALLOWED = ["name", "email", "password", "address", "phone_number"];
    const data = {};

    for (const key of ALLOWED) {
      if (info[key] !== undefined) {
        if (key === "password") {
          data.password = await hashPassword(info.password);
        } else {
          data[key] = info[key];
        }
      }
    }

    let updated;

    if (Object.keys(data).length > 0) {
      if (role == "FARMER") {
        await this.db.farmer.update({
          where: { id: user_id },
          data: { ...data },
        });

        updated = await this.db.farmer.findFirst({
          where: { id: user_id },
        });

        delete updated.password;

        return updated;
      } else if (role == "CUSTOMER") {
        await this.db.customer.update({
          where: { id: user_id },
          data: { ...data },
        });

        updated = await this.db.customer.findFirst({
          where: { id: user_id },
        });
        delete updated.password;

        return updated;
      }
    } else {
      throw this.error.badRequest("No valid fields to update");
    }
  }

  async updateProfilePicture(image_path, user_id, role) {
    let updated;
    if (role == "FARMER") {
      const previousImage = await this.db.farmer.findUnique({
        where: { id: user_id },
        select: { image_url: true },
      });

      if (previousImage.image_url !== null) {
        previousImageDelete(previousImage.image_url);
      }

      await this.db.farmer.update({
        where: { id: user_id },
        data: { image_url: image_path },
      });
      updated = await this.db.farmer.findFirst({
        where: { id: user_id },
      });
    } else if (role == "CUSTOMER") {
      const previousImage = await this.db.customer.findUnique({
        where: { id: user_id },
        select: { image_url: true },
      });

      if (previousImage.image_url !== null) {
        previousImageDelete(previousImage.image_url);
      }

      await this.db.customer.update({
        where: { id: user_id },
        data: { image_url: image_path },
      });
      updated = await this.db.customer.findFirst({
        where: { id: user_id },
      });
    }

    delete updated.password;

    return updated;
  }
}

function previousImageDelete(filePath) {
  if (!filePath) return;
  const fullPath = path.join(process.cwd(), "public", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      logger.error("Error deleting file:", err);
    } else {
      logger.info(`${filePath} was deleted successfully.`);
    }
  });
}

export default new ProfileService();
