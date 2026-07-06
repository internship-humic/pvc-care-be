import BaseService from "../../common/base_classes/base-service.js";

class NotificationService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Buat notifikasi baru (digunakan secara internal oleh service lain)
   */
  async createNotification({ userId, type, title, message }) {
    const notification = await this.db.notification.create({
      data: {
        user_id: userId,
        type,
        title,
        message,
      },
    });

    return notification;
  }

  /**
   * Ambil semua notifikasi milik user yang sedang login
   */
  async getMyNotifications(userId, query = {}) {
    const page = Math.max(parseInt(query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const where = { user_id: userId };

    // Filter by read status jika diberikan
    if (query.is_read !== undefined) {
      where.is_read = query.is_read === "true";
    }

    const [notifications, total] = await Promise.all([
      this.db.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.db.notification.count({ where }),
    ]);

    return {
      data: notifications,
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Hitung jumlah notifikasi yang belum dibaca
   */
  async getUnreadCount(userId) {
    const count = await this.db.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });

    return { unread_count: count };
  }

  /**
   * Tandai satu notifikasi sebagai sudah dibaca
   */
  async markAsRead(notificationId, userId) {
    const notification = await this.db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw this.error.notFound("Notification not found");
    }

    if (notification.user_id !== userId) {
      throw this.error.forbidden("You are not authorized to update this notification");
    }

    const updated = await this.db.notification.update({
      where: { id: notificationId },
      data: { is_read: true },
    });

    return updated;
  }

  /**
   * Tandai semua notifikasi user sebagai sudah dibaca
   */
  async markAllAsRead(userId) {
    const result = await this.db.notification.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: { is_read: true },
    });

    return { updated_count: result.count };
  }

  /**
   * Hapus satu notifikasi
   */
  async deleteNotification(notificationId, userId) {
    const notification = await this.db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw this.error.notFound("Notification not found");
    }

    if (notification.user_id !== userId) {
      throw this.error.forbidden("You are not authorized to delete this notification");
    }

    await this.db.notification.delete({
      where: { id: notificationId },
    });

    return { message: "Notification deleted successfully" };
  }
}

export default new NotificationService();
