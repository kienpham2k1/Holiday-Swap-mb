export class NotificationResponse {
    constructor(notificationId, createdOn, isRead) {
        this.notification = {
            notificationId,
            subject: null,
            content: null,
            href: null,
            createdOn,
            isRead,
        };
    }

    withSubject(subject) {
        this.notification.subject = subject;
        return this;
    }

    withContent(content) {
        this.notification.content = content;
        return this;
    }

    withHref(href) {
        this.notification.href = href;
        return this;
    }

    build() {
        return this.notification;
    }
}
