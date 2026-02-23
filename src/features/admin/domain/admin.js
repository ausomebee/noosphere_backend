class Admin {
    constructor({ id, firstName, lastName, email, phoneNumber, departmentId, roleId, superAdmin = false, password, authType }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.departmentId = departmentId;
        this.roleId = roleId;
        this.superAdmin = superAdmin;
        this.password = password;
        this.authType = authType;
    }

    get createAdmin() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phoneNumber: this.phoneNumber,
            roleId: this.roleId,
            superAdmin: this.superAdmin,
            departmentMembers: {
                create: {
                    departmentId: this.departmentId
                }
            }
        };
    }

}

export default Admin;