"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesController = void 0;
var source_1 = require("../source");
var features_entity_1 = require("../entity/features.entity");
var FeaturesController = /** @class */ (function () {
    function FeaturesController() {
        this.repository = source_1.dbSource.getRepository(features_entity_1.Features);
    }
    FeaturesController.prototype.getAll = function () {
        return this.repository.find();
    };
    FeaturesController.prototype.insert = function (price, time, type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var feature = new features_entity_1.Features();
            feature.price = price;
            feature.time = time;
            feature.type = type;
            _this.repository
                .save(feature)
                .then(function (_) { return resolve("OK"); })
                .catch(function (_) { return reject("ERROR"); });
        });
    };
    FeaturesController.prototype.update = function (id, args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.repository.findOneBy({
                id: id
            })
                .then(function (feature) {
                if (!feature) {
                    resolve("FAIL");
                }
                var shouldUpdate = false;
                if (args.price) {
                    feature.price = args.price;
                    shouldUpdate = true;
                }
                if (args.time) {
                    feature.time = args.time;
                    shouldUpdate = true;
                }
                if (args.type) {
                    feature.type = args.type;
                    shouldUpdate = true;
                }
                if (!shouldUpdate)
                    resolve("OK");
                return _this.repository.save(feature);
            })
                .then(function (_) { return resolve("OK"); })
                .catch(function (_) { return reject("ERROR"); });
        });
    };
    FeaturesController.prototype.delete = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.repository
                .findOneBy({ id: id })
                .then(function (feature) { return _this.repository.remove(feature); })
                .then(function (_) { return resolve("OK"); })
                .catch(function (_) { return reject("ERROR"); });
        });
    };
    return FeaturesController;
}());
exports.FeaturesController = FeaturesController;
