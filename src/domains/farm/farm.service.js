import BaseService from "../../common/base_classes/base-service.js";
import { getPagination, getMeta } from "../../utils/pagination.util.js";
import { SQLfilterable } from "../../utils/filter.util.js";
import logger from "../../utils/logger.util.js";

class FarmService extends BaseService {
  constructor() {
    super();
    // this.error = BaseError
    // this.db = Prisma
  }

  async getFarmById(id) {
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
        WHERE id = ${id};
      `;

    if (data.length === 0) {
      throw this.error.notFound("Farm not found");
    }

    return data;
  }

  async getAllFarm(query) {
    const { page, limit, offset } = getPagination(query);

    const filter = SQLfilterable(query, ["name", "address"]);
    const whereClause = filter && filter !== "1=1" ? `WHERE ${filter}` : "";

    // ternyata wajib pakai raw unsafe, karena kalau pake raw biasa
    // gak bisa pake template literal buat where clause
    // hanya saja ga aman sebenarnya tapi kan cuman get doang
    const totalResult = await this.db.$queryRawUnsafe(`
      SELECT COUNT(*)::int AS total FROM farms ${whereClause}
    `);
    const total = totalResult[0]?.total || 0;

    const data = await this.db.$queryRawUnsafe(`
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
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Untuk metadata pagination jadi biar kek chaining
    const meta = getMeta(total, page, limit);

    return { data, meta };
  }

  async getNearestFarm(info) {
    const { latitude, longitude, maxDistance } = info;

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
      updated_at,
      ST_Distance(
        pinpoints::geography,
        ST_SetSRID(ST_MakePoint(${Number(longitude)}, ${Number(
      latitude
    )}), 4326)
      ) AS distance
    FROM farms
        WHERE ST_Distance(
        pinpoints::geography,
        ST_SetSRID(ST_MakePoint(${Number(longitude)}, ${Number(
      latitude
    )}), 4326)
      ) <= ${maxDistance}
    ORDER BY distance ASC
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
          description,
          address,
          ST_Y(pinpoints::geometry) AS latitude,
          ST_X(pinpoints::geometry) AS longitude,
          created_at, 
          updated_at;
      `;
    return created[0];
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
            WHERE id = ${id} AND farmer_id = ${farmer_id}
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

    return updated[0];
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

    if (deleted.length === 0) {
      throw this.error.notFound("Farm not found or you are not the owner.");
    }
    return deleted[0];
  }
}

export default new FarmService();
