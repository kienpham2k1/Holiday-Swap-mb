export class User {
    constructor(userId, email, username, gender, dob, phone, status) {
        this.user = {
            userId,
            email,
            username,
            fullName: null,
            gender,
            dob,
            phone,
            avatar: null,
            status,
            role: { roleId: 0, name: '' },
            createdOn: '',
            createdBy: '',
            lastModifiedOn: '',
            lastModifiedBy: '',
            email_verified: false,
            phone_verified: false,
        };
    }

    withFullName(fullName) {
        this.user.fullName = fullName;
        return this;
    }

    withAvatar(avatar) {
        this.user.avatar = avatar;
        return this;
    }

    withRole(roleId, roleName) {
        this.user.role = { roleId, name: roleName };
        return this;
    }

    withCreatedInfo(createdOn, createdBy) {
        this.user.createdOn = createdOn;
        this.user.createdBy = createdBy;
        return this;
    }

    withLastModifiedInfo(lastModifiedOn, lastModifiedBy) {
        this.user.lastModifiedOn = lastModifiedOn;
        this.user.lastModifiedBy = lastModifiedBy;
        return this;
    }

    withEmailVerification(emailVerified) {
        this.user.email_verified = emailVerified;
        return this;
    }

    withPhoneVerification(phoneVerified) {
        this.user.phone_verified = phoneVerified;
        return this;
    }

    build() {
        return this.user;
    }
}