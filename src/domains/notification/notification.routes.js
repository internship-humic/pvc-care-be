import NotificationController from "./notification.controller.js";
import BaseRoutes from "../../common/base_classes/base-routes.js";

class NotificationRoutes extends BaseRoutes {
  constructor() {
    super(NotificationController);
  }

  routes() {
    // GET /notifications - Ambil semua notifikasi milik user
    this.router.get("/", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.getMyNotifications.bind(this.controller)),
    ]);

    // GET /notifications/unread-count - Jumlah notifikasi belum dibaca
    this.router.get("/unread-count", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.getUnreadCount.bind(this.controller)),
    ]);

    // PATCH /notifications/read-all - Tandai semua notifikasi sebagai dibaca
    this.router.patch("/read-all", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.markAllAsRead.bind(this.controller)),
    ]);

    // PATCH /notifications/:id/read - Tandai satu notifikasi sebagai dibaca
    this.router.patch("/:id/read", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.markAsRead.bind(this.controller)),
    ]);

    // DELETE /notifications/:id - Hapus satu notifikasi
    this.router.delete("/:id", [
      this.auth.authenticate,
      this.auth.role([this.roles.Patient, this.roles.Doctor]),
      this.errCatch(this.controller.deleteNotification.bind(this.controller)),
    ]);
  }
}

export default new NotificationRoutes().router;
