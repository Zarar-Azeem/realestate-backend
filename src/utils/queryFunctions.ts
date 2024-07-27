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


export const getLocation = ( properties : any, value: string ): Property[] =>{
    let result : Property[] = []
    
    if( value == undefined || value.length == 0 ){
        return properties
    } else {
        for ( let i=0; i<properties.length; i++ ){
            if( (properties[i].description.location).toLowerCase() == value.toLowerCase() ){
            result.push(properties[i])
            }
        }
    }
    return result
}   

export const getBedrooms = ( properties : Property[] , value: string ) : Property[] =>{
    let result : Property[] = []
    
    if( value == undefined || value == ''){
        return properties
    } else {
        for ( let i=0; i<properties.length; i++ ){
            if( properties[i].description.bedrooms == parseInt(value)){
            result.push(properties[i])
            }
        }
    }
    return result
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