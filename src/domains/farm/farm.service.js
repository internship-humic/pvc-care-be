
import BaseError from "../../common/base_classes/base-error.js";
import Prisma from "../../common/services/prisma.service.js";

class FarmService {
  constructor() {
    this.prisma = Prisma;
  }
  
  async someMethod() {
    // Implement service logic here
  }
}

export default new FarmService();
