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
exports.getFullSavedProperties = void 0;
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
// export const getType = ( properties : Property[] , value: number ) =>{
//     let result : Property[] = []
//     for ( let i=0; i<properties.length; i++ ){
//         if( properties[i].description.bedrooms == value){
//             result.push(properties[i])
//         } else if( value == undefined){
//             return properties
//         }
//     }
//     return result
// }   
const getFullSavedProperties = (propertyIds) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedPosts = yield propertyModel_1.default.find({ _id: { $in: propertyIds } });
        return savedPosts;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.getFullSavedProperties = getFullSavedProperties;
