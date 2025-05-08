class Admin {
    constructor({ id, fullName, email, phoneNumber, roleId, superAdmin = false, password }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.roleId = roleId;
        this.superAdmin = superAdmin;
        this.password = password;
    }

    get createAdmin() {
        return {
            fullName: this.fullName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            roleId: this.roleId,
            superAdmin: this.superAdmin,
            authType: this.authType
        };
    }

}

export default Admin;