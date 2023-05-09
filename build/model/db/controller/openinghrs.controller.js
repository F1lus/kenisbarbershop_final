"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpeninghrsController = void 0;
var source_1 = require("../source");
var openinghrs_1 = require("../entity/openinghrs");
var OpeninghrsController = /** @class */ (function () {
    function OpeninghrsController() {
        this.repository = source_1.dbSource.getRepository(openinghrs_1.Openinghrs);
    }
    OpeninghrsController.prototype.selectAll = function () {
        return this.repository.find();
    };
    OpeninghrsController.prototype.toWeekday = function (ohr) {
        switch (ohr.day) {
            case "Hétfő": return 1;
            case "Kedd": return 2;
            case "Szerda": return 3;
            case "Csütörtök": return 4;
        }
    };
    return OpeninghrsController;
}());
exports.OpeninghrsController = OpeninghrsController;
