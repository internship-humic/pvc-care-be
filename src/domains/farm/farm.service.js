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

    if (data.length === 0) {
      throw this.error.notFound("Farm not found");
    }

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
    const created = await this.db.$queryRaw`
        INSERT INTO "farms"(
          id, 
          farmer_id, 
          name, 
          description,
			    address,
          pinpoints,
          updated_at
        )
        VALUES (
          ${id},
          ${farmer_id},
          ${name},
          ${description},
          ${address},
          ST_SetSRID(ST_MakePoint(${Number(longitude)}, ${Number(
      latitude
    )}),4326),
          Now()
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
    return created;
  }

  async updateFarm(farmer_id, id, info) {
    const ALLOWED = ["name", "description", "address", "latitude", "longitude"];
    const data = {};

    for (const key of ALLOWED) {
      if (info[key] !== undefined) {
        data[key] = info[key];
      }
    }

    if (Object.keys(data).length > 0) {
      if (info["latitude"] !== undefined && info["longitude"] !== undefined) {
        await this.db.$queryRaw`
            UPDATE "farms"
            SET pinpoints = ST_SetSRID(ST_MakePoint(${Number(
              info["longitude"]
            )}, ${Number(info["latitude"])}),4326),
            updated_at = NOW()
            WHERE id = '${id}' AND farmer_id = '${farmer_id}'
          `;
      } else if (
        (info["latitude"] === undefined && info["longitude"] !== undefined) ||
        (info["latitude"] !== undefined && info["longitude"] === undefined)
      ) {
        throw this.error.badRequest(
          "Both latitude and longitude must be provided together."
        );
      }
      // biar data lat dan long gak masuk ke query ORM
      // karena bisa jadi inputannya lat long dan juga nama, desc, address
      // jadi harus dihapus biar gak error (sumpah ribet)
      delete data.latitude;
      delete data.longitude;

      await this.db.farm.update({
        where: { id, farmer_id },
        data: { ...data },
      });
    } else {
      throw this.error.BadRequest("No valid fields to update");
    }

    const updated = await this.db.$queryRaw`
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
    WHERE id = ${id} AND farmer_id = ${farmer_id}
  `;

    return updated;
  }

  async deleteFarm(farmer_id, id) {
    const deleted = await this.db.$queryRaw`
      DELETE FROM "farms"
      WHERE id = ${id} AND farmer_id = ${farmer_id}
      RETURNING
        id,
        farmer_id,
        name,
        description,
        address,
        ST_Y(pinpoints::geometry) AS latitude,
        ST_X(pinpoints::geometry) AS longitude,
        created_at,
        updated_at;
    `;
    return deleted;
  }
}

export default new FarmService();
