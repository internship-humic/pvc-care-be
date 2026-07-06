import BaseController from "../../common/base_classes/base-controller.js";
import NotificationService from "./notification.service.js";

class NotificationController extends BaseController {
  constructor() {
    super(NotificationService);
  }

  async getMyNotifications(req, res) {
    const userId = req.user.id;
    const result = await this.service.getMyNotifications(userId, req.query);
    return this.response.success(res, result, "Success fetch notifications");
  }

  async getUnreadCount(req, res) {
    const userId = req.user.id;
    const result = await this.service.getUnreadCount(userId);
    return this.response.success(res, result, "Success fetch unread count");
  }

  async markAsRead(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await this.service.markAsRead(id, userId);
    return this.response.success(res, result, "Notification marked as read");
  }

  async markAllAsRead(req, res) {
    const userId = req.user.id;
    const result = await this.service.markAllAsRead(userId);
    return this.response.success(res, result, "All notifications marked as read");
  }

  async deleteNotification(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await this.service.deleteNotification(id, userId);
    return this.response.success(res, result, "Notification deleted successfully");
  }
}

export default new NotificationController();
