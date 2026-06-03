
import PvcScanService from "./pvc-scan.service.js";
import BaseController from "../../common/base_classes/base-controller.js";

class PvcScanController extends BaseController {
  constructor() {
    super(PvcScanService);
  }

  async uploadScan(req, res) {
    if (!req.file) {
      throw this.error.badRequest("Image file is required.");
    }
    
    // Construct public url if needed, e.g., /images/filename
    const documentUrl = `/images/${req.file.filename}`;
    
    // We get patient id from the auth token
    const userId = req.user.id;
    
    const result = await this.service.uploadScan(userId, documentUrl, req.body);
    
    return this.response.created(res, "Scan uploaded successfully and is now pending", result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await this.service.getById(id);
    return this.response.success(res, "Success fetch scan", result);
  }

  async getAllFromUser(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    
    const result = await this.service.getAllFromUser(userId, role);
    
    return this.response.success(res, "Success fetch user's scans", result);
  }
}

export default new PvcScanController();
