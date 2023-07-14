"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
var source_1 = require("../source");
var user_entity_1 = require("../entity/user.entity");
var UserController = /** @class */ (function () {
    function UserController() {
        this.repository = source_1.dbSource.getRepository(user_entity_1.User);
    }
    UserController.prototype.validateUser = function (name) {
        return this.repository.findOneByOrFail({ name: name });
    };
    return UserController;
}());
exports.UserController = UserController;
