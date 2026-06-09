
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
    
    const documentUrl = `/images/${req.file.filename}`;
    
    const userId = req.user.id;
    
    const result = await this.service.uploadScan(userId, documentUrl, req.body);
    
    return this.response.created(res, result, "Scan uploaded successfully and is now pending");
  }

  async getHistorySummary(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    const result = await this.service.getHistorySummary(userId, role);
    return this.response.success(res, result, "Success fetch scan summary");
  }

  async getDoctorDashboardSummary(req, res) {
    const userId = req.user.id;
    const result = await this.service.getDoctorDashboardSummary(userId);
    return this.response.success(res, result, "Success fetch doctor dashboard summary");
  }

  async getHistory(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    const result = await this.service.getHistory(userId, role, req.query);
    return this.response.success(res, result, "Success fetch scan history");
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await this.service.getById(id);
    return this.response.success(res, result, "Success fetch scan");
  }

  async getAllFromUser(req, res) {
    const userId = req.user.id;
    const role = req.user.role;
    
    const result = await this.service.getAllFromUser(userId, role);
    
    return this.response.success(res, result, "Success fetch user's scans");
  }

  async assignDoctor(req, res) {
    const { id } = req.params;
    const { patient_note } = req.body || {};
    const userId = req.user.id;

    const result = await this.service.assignDoctor(id, userId, patient_note);
    
    return this.response.success(res, result, "Doctor assigned successfully");
  }

  async verifyScan(req, res) {
    const { id } = req.params;
    const { final_result, doctor_note } = req.body || {};
    const userId = req.user.id;

    const result = await this.service.verifyScan(id, userId, final_result, doctor_note);

    return this.response.success(res, result, "PVC scan verified successfully");
  }
}

export default new PvcScanController();
