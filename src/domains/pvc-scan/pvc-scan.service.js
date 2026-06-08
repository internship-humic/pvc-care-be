
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

  async assignDoctor(scanId, userId, patientNote) {
    const patientProfile = await this.db.patientProfile.findUnique({
      where: { user_id: userId }
    });

    if (!patientProfile) {
      throw this.error.notFound("Patient profile not found for this user");
    }

    const scan = await this.db.pvcScan.findUnique({
      where: { id: scanId }
    });

    if (!scan) {
      throw this.error.notFound("PvcScan not found");
    }

    if (scan.patient_profile_id !== patientProfile.id) {
      throw this.error.forbidden("You are not authorized to update this scan");
    }

    const doctors = await this.db.doctorProfile.findMany();
    if (!doctors || doctors.length === 0) {
      throw this.error.internal("No doctors available to assign");
    }

    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    const updatedScan = await this.db.pvcScan.update({
      where: { id: scanId },
      data: {
        doctor_profile_id: randomDoctor.id,
        patient_note: patientNote || null,
      }
    });

    return updatedScan;
  }
}

export default new PvcScanService();
