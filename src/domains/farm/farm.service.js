import BaseService from "../../common/base_classes/base-service.js";

class FarmService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getFarmById(farmer_id, id) {
    const data = await this.db.$queryRaw`
        SELECT 
          id, 
          farmer_id, 
          name, 
          description,
          address,
          ST_Y(pinpoints::geometry) AS latitude,
          ST_X(pinpoints::geometry) AS longitude,
          created_at, 
          updated_at
        FROM farms
        WHERE farmer_id = ${farmer_id} AND id = ${id};
      `;

    return data;
  }

  async getAllFarm() {
    const data = await this.db.$queryRaw`
        SELECT 
          id, 
          farmer_id, 
          name, 
          description,
          address,
          ST_Y(pinpoints::geometry) AS latitude,
          ST_X(pinpoints::geometry) AS longitude,
          created_at, 
          updated_at
        FROM farms
      `;

    return data;
  }

  async createFarm(farmer_id, info) {
    const { name, description, address, latitude, longitude } = info;

    const id = crypto.randomUUID();
    const data = await this.db.$queryRaw`
        INSERT INTO "farms"(
          id, 
          farmer_id, 
          name, 
          description,
			    address,
          pinpoints
        )
        VALUES (
          ${id},
          ${farmer_id},
          ${name},
          ${description},
          ${address},
          ST_SetSRID(ST_MakePoint(${Number(longitude)}, ${Number(
      latitude
    )}),4326)
	      )
        RETURNING 
          id, 
          farmer_id, 
          name, 
          description
          address,
          ST_Y(pinpoints::geometry) AS latitude,
          ST_X(pinpoints::geometry) AS longitude,
          created_at, 
          updated_at;
      `;
    return data;
  }
}

export default new FarmService();
