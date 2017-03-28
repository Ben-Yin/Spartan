module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    var AdminSchema = require('./admin.schema.server')();
    var AdminModel = mongoose.model("AdminModel", AdminSchema);

    var api = {
        createAdmin : createAdmin,
        findAdminById: findAdminById,
        updateAdmin: updateAdmin,
        deleteAdmin: deleteAdmin,
        findAdminByCredential:findAdminByCredential,
        findAdminByName: findAdminByName
    };
    return api;

    function createAdmin(admin) {
        return AdminModel.create(admin);
    }

    function findAdminById(adminId) {
        return AdminModel.findById(adminId);
    }

    function updateAdmin(adminId, admin) {
        return AdminModel
            .update(
                {
                    _id: adminId
                },
                {
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    phone: admin.phone
                }
            );
    }

    function deleteAdmin(adminId) {
        return AdminModel
            .remove({_id: adminId});
    }

    function findAdminByCredential(adminName, password){
        return AdminModel
            .findOne(
                {
                    adminName : adminName,
                    password : password
                }
            );
    }

    function findAdminByName(adminName) {
        return AdminModel
            .findOne({adminName: adminName});
    }
};