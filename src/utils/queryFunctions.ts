import { ObjectId } from "mongodb"
import Property from '../models/propertyModel'

type Property = {
    title: string,
    body: string,
    price: number,
    description: {
        location: string,
        size: number,
        bedrooms: number,
        bathrooms: number
    }
}



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


export const getFullSavedProperties = async (propertyIds : any) => {
    try {
      const savedPosts = await Property.find({ _id: { $in: propertyIds } });
      return savedPosts;
    } catch (error) {
      console.error(error);
      return null;
    }
  };