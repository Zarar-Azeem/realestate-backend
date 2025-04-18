"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getUserProperty = exports.getProperty = exports.createProperty = exports.searchProperty = exports.saveProperty = exports.getSavedProperty = exports.getUserProperties = exports.getProperties = void 0;
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const queryFunctions_1 = require("../utils/queryFunctions");
const cloudinary_1 = require("../utils/cloudinary");
var Type;
(function (Type) {
    Type["RENT"] = "rent";
    Type["SELL"] = "sell";
})(Type || (Type = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType["LAND"] = "land";
    PropertyType["HOUSE"] = "house";
    PropertyType["APPARTMENT"] = "appartment";
})(PropertyType || (PropertyType = {}));
const getProperties = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield propertyModel_1.default.find().exec();
        console.log(properties);
        return res.status(200).json(properties);
    }
    catch (error) {
        next(error);
    }
});
exports.getProperties = getProperties;
const getUserProperties = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const properties = yield propertyModel_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }).exec();
        res.status(200).json(properties);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserProperties = getUserProperties;
const getSavedProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        let properties = yield userModel_1.default.findById(id).select('savedProperties');
        const savedProperties = yield (0, queryFunctions_1.getFullSavedProperties)(properties === null || properties === void 0 ? void 0 : properties.savedProperties);
        return res.status(200).json(savedProperties);
    }
    catch (error) {
        next(error);
    }
});
exports.getSavedProperty = getSavedProperty;
const saveProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const userId = req.user.id;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const propertyExists = yield propertyModel_1.default.findById({ _id: id });
        if (!propertyExists) {
            return res.status(404).json({ message: 'Property does not exists' });
        }
        const savedProperties = user.savedProperties;
        const propertyIndex = savedProperties.indexOf(id);
        let property, message;
        if (savedProperties.includes(id)) {
            property = savedProperties.splice(propertyIndex, 1);
            message = " Property Removed";
        }
        else {
            property = savedProperties.push(id);
            message = " Property Added";
        }
        yield user.save();
        return res.status(200).json({ message, property: id });
    }
    catch (error) {
        next(error);
    }
});
exports.saveProperty = saveProperty;
const searchProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const query = req.query;
    const type = query.type;
    const propertytype = query.propertytype;
    const bedrooms = query.bedrooms;
    const location = query.location;
    const minPrice = (_b = query.minPrice) !== null && _b !== void 0 ? _b : 0;
    const maxPrice = (_c = query.maxPrice) !== null && _c !== void 0 ? _c : 1000000;
    console.log(typeof maxPrice, maxPrice);
    let result;
    try {
        let query = { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } };
        if (location) {
            query['description.location'] = location;
        }
        if (type) {
            query['type'] = type;
        }
        if (propertytype) {
            query['propertytype'] = propertytype;
        }
        if (bedrooms) {
            query['description.bedrooms'] = bedrooms;
        }
        result = yield propertyModel_1.default.find(query);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
});
exports.searchProperty = searchProperty;
const createProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, price, type, propertytype, size, bathrooms, bedrooms, location } = req.body;
    let reqFiles = req.files;
    let imageUrlList = [];
    if (reqFiles) {
        for (var i = 0; i < reqFiles.length; i++) {
            let locaFilePath = reqFiles[i];
            let result = yield (0, cloudinary_1.uploadOnCloudinary)(locaFilePath.path);
            imageUrlList.push(result === null || result === void 0 ? void 0 : result.secure_url);
        }
    }
    try {
        const property = yield propertyModel_1.default.create({
            userId: req.user.id,
            title,
            images: imageUrlList,
            price,
            body,
            type,
            property: propertytype,
            description: {
                location,
                bathrooms,
                bedrooms,
                size
            }
        });
        return res.status(201).json({ success: true, property });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createProperty = createProperty;
const getProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const property = yield propertyModel_1.default.findById({ _id: id });
        res.status(201).json(property);
    }
    catch (error) {
        next(error);
    }
});
exports.getProperty = getProperty;
const getUserProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const property = yield propertyModel_1.default.find({ userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id });
        return res.status(201).json(property);
    }
    catch (error) {
        console.log("ThIS ONE RIGHT HERE");
        next(error);
    }
});
exports.getUserProperty = getUserProperty;
const updateProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const id = req.params.id;
    const { title, body, price, location, size, bathrooms, bedrooms, } = req.body;
    try {
        let property = yield propertyModel_1.default.findById(id);
        if (property.userId.toString() != ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id)) {
            return res.status(400).json({ message: "Not Allowed" });
        }
        const newProperty = {
            title,
            price,
            body,
            description: {
                location,
                bathrooms,
                bedrooms,
                size
            }
        };
        property = yield propertyModel_1.default.findByIdAndUpdate(id, { $set: newProperty }, { new: true });
        res.status(201).json({ success: true, property });
    }
    catch (error) {
        next(error);
    }
});
exports.updateProperty = updateProperty;
const deleteProperty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        let property = yield propertyModel_1.default.findById(id);
        if (property.userId.toString() != req.user.id) {
            return res.status(400).json({ message: "Not Allowed" });
        }
        property = yield propertyModel_1.default.findByIdAndDelete({ _id: id });
        res.status(201).json(property);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProperty = deleteProperty;
// export const deleteArrayProperty = async (req: Request ,res: Response , next: NextFunction)=>{
//     try{
//         const property = await Property.deleteMany({ description: { $exists: true, $type: 'array' } });
//         res.status(201).json(property)
//     } catch (error) {
//         next(error)
//     }
// }
