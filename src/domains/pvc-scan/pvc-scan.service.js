
import BaseService from "../../common/base_classes/base-service.js";

class PvcScanService extends BaseService {
  constructor() {
    super();
  }

  buildScanDetail(scan) {
    const confidence = scan.ai_confidence ?? (scan.ai_result ? (scan.verification_status === "Verified" ? 98 : 90) : null);

    return {
      ...scan,
      ai_confidence: confidence,
      doctor: scan.doctor
        ? {
            id: scan.doctor.id,
            name: scan.doctor.name,
            profile_photo: scan.doctor.profile_photo,
          }
        : null,
      patient: scan.patient
        ? {
            id: scan.patient.id,
            name: scan.patient.name,
          }
        : null,
    };
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
      ai_result: "Sample Result",
      ai_confidence: 90,
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

  async getHistorySummary(userId, role) {
    const where = await this.buildAccessWhere(userId, role);

    const scans = await this.db.pvcScan.findMany({
      where,
      select: {
        verification_status: true,
        ai_result: true,
        ai_confidence: true,
      },
    });

    const totalScans = scans.length;
    const verifiedCount = scans.filter((scan) => scan.verification_status === "Verified").length;
    const pendingCount = scans.filter((scan) => scan.verification_status === "Pending").length;
    const confidenceValues = scans
      .map((scan) => scan.ai_confidence ?? (scan.ai_result ? (scan.verification_status === "Verified" ? 98 : 90) : null))
      .filter((value) => value !== null);
    const averageConfidence = confidenceValues.length
      ? Math.round(confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length)
      : null;

    return {
      total_scans: totalScans,
      verified_count: verifiedCount,
      pending_count: pendingCount,
      avg_confidence: averageConfidence,
    };
  }

  async getDoctorDashboardSummary(userId) {
    const doctorProfile = await this.db.doctorProfile.findUnique({
      where: { user_id: userId }
    });

    if (!doctorProfile) {
      throw this.error.notFound("Doctor profile not found for this user");
    }

    if (doctorProfile.verification_status !== "Verified") {
      throw this.error.forbidden("Only verified doctors can access the dashboard summary");
    }

    const totalVerified = await this.db.pvcScan.count({
      where: {
        doctor_profile_id: doctorProfile.id,
        verification_status: "Verified",
      },
    });

    return {
      total_verified: totalVerified,
    };
  }

  async getHistory(userId, role, query = {}) {
    const where = await this.buildAccessWhere(userId, role, query.status);
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [scans, total] = await Promise.all([
      this.db.pvcScan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          doctor: true,
          patient: true,
        },
      }),
      this.db.pvcScan.count({ where }),
    ]);

    return {
      data: scans.map((scan) => this.buildScanDetail(scan)),
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async getById(id) {
    const scan = await this.db.pvcScan.findUnique({
      where: { id },
      include: {
        doctor: true,
        patient: true,
      }
    });
    
    if (!scan) {
      throw this.error.notFound("PvcScan not found");
    }
    
    return this.buildScanDetail(scan);
  }

  async getAllFromUser(userId, role) {
    const history = await this.getHistory(userId, role, { page: "1", limit: "100" });
    return history.data;
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

    const doctors = await this.db.doctorProfile.findMany({
      where: { verification_status: "Verified" }
    });
    if (!doctors || doctors.length === 0) {
      throw this.error.badRequest("No verified doctors are available to assign.");
    }

    const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];

    const updatedScan = await this.db.pvcScan.update({
      where: { id: scanId },
      data: {
        doctor_profile_id: randomDoctor.id,
        patient_note: patientNote || null,
        verification_status: "Pending",
      }
    });

    return updatedScan;
  }

  async verifyScan(scanId, userId, finalResult, doctorNote) {
    const doctorProfile = await this.db.doctorProfile.findUnique({
      where: { user_id: userId }
    });

    if (!doctorProfile) {
      throw this.error.notFound("Doctor profile not found for this user");
    }

    if (doctorProfile.verification_status !== "Verified") {
      throw this.error.forbidden("Only verified doctors can verify PVC scans");
    }

    const scan = await this.db.pvcScan.findUnique({
      where: { id: scanId }
    });

    if (!scan) {
      throw this.error.notFound("PvcScan not found");
    }

    if (scan.doctor_profile_id !== doctorProfile.id) {
      throw this.error.forbidden("You are not authorized to verify this scan");
    }

    const updatedScan = await this.db.pvcScan.update({
      where: { id: scanId },
      data: {
        final_result: finalResult,
        doctor_note: doctorNote || null,
        ai_confidence: 98,
        verification_status: "Verified",
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    return this.buildScanDetail(updatedScan);
  }

  async buildAccessWhere(userId, role, status) {
    const where = {};

    if (status) {
      where.verification_status = status;
    }

    if (role === "Patient") {
      const patientProfile = await this.db.patientProfile.findUnique({
        where: { user_id: userId }
      });
      if (!patientProfile) {
        throw this.error.notFound("Patient profile not found for this user");
      }
      where.patient_profile_id = patientProfile.id;
      return where;
    }

    if (role === "Doctor") {
      const doctorProfile = await this.db.doctorProfile.findUnique({
        where: { user_id: userId }
      });
      if (!doctorProfile) {
        throw this.error.notFound("Doctor profile not found for this user");
      }
      where.doctor_profile_id = doctorProfile.id;
      return where;
    }

    return where;
  }
}

export default new PvcScanService();
