import axios from './Request';

const api = {
  replyNotification: "/notifications/{notification}/reply",
  getNotificationList: "/user/notifications",
  updateNotificationRead: "/user/notifications/read"
};

const NotificationRequest = {
  replyNotification(notificationId, data) {
    const url = api.replyNotification.replace("{notification}", notificationId);
    return new Promise((resolve, reject) => {
      axios.patch(url, data).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    })
  },
  getNotificationList(hasReplies=false) {
    const config = hasReplies ? {
      params: {
        include: "replies"
      }
    } : {};
    return new Promise((resolve, reject) => {
      axios.get(api.getNotificationList, config).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
    });
  },
  deleteNotifications (dataIds) {
    return new Promise((resolve, reject) => {
      axios.delete(api.getNotificationList, {
        data: {
          notification_ids: dataIds
        }
      }).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },
  updateNotificationRead (dataIds) {
    return new Promise((resolve, reject) => {
      axios.patch(api.updateNotificationRead, {
        notification_ids: dataIds
      }).then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default NotificationRequest;