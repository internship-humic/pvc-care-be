
import BaseService from "../../common/base_classes/base-service.js";

class PvcScanService extends BaseService {
  constructor() {
    super();
  }
  
  async uploadScan(userId, documentUrl, data) {
    const patientProfile = await this.db.patientProfile.findUnique({
      where: { user_id: userId }
    });

    if (!patientProfile) {
      throw this.error.notFound("Patient profile not found for this user");
    }

    const payload = {
      patient_profile_id: patientProfile.id,
      document_url: documentUrl,
      verification_status: "Pending",
    };

    if (data.patient_note) {
      payload.patient_note = data.patient_note;
    }
    
    if (data.doctor_profile_id) {
      payload.doctor_profile_id = data.doctor_profile_id;
    }

    const scan = await this.db.pvcScan.create({
      data: payload,
    });

    return scan;
  }

  async getById(id) {
    const scan = await this.db.pvcScan.findUnique({
      where: { id }
    });
    
    if (!scan) {
      throw this.error.notFound("PvcScan not found");
    }
    
    return scan;
  }

  async getAllFromUser(userId, role) {
    if (role === "Patient") {
      const patientProfile = await this.db.patientProfile.findUnique({
        where: { user_id: userId }
      });
      if (!patientProfile) {
        throw this.error.notFound("Patient profile not found for this user");
      }
      return await this.db.pvcScan.findMany({
        where: { patient_profile_id: patientProfile.id },
        orderBy: { created_at: "desc" }
      });
    }

    if (role === "Doctor") {
      const doctorProfile = await this.db.doctorProfile.findUnique({
        where: { user_id: userId }
      });
      if (!doctorProfile) {
        throw this.error.notFound("Doctor profile not found for this user");
      }
      return await this.db.pvcScan.findMany({
        where: { doctor_profile_id: doctorProfile.id },
        orderBy: { created_at: "desc" }
      });
    }

    return await this.db.pvcScan.findMany({
      orderBy: { created_at: "desc" }
    });
  }
}

export default new PvcScanService();
