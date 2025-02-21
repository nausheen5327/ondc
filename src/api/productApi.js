import { getCall } from "./MainApi";

/**
 * function to get all products
 * @returns
 */
export const getAllProductRequest = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let location = localStorage.getItem('location');
            let latitude = null;
            let longitude = null;
            if(location)
            {
                latitude = JSON.parse(location).address.lat;
                longitude = JSON.parse(location).address.lng;
            }
            console.log("inside search API", latitude, longitude);
            const data = await getCall(`/clientApis/v2/search`, params);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get all filters
 * @returns
 */
export const getAllFiltersRequest = (subCatName=null, providerId=null) => {
    let params = {};
    if(subCatName){
        let subCategoryName = subCatName.replace("And", "&");
        params.category = subCategoryName;
    }
    if(providerId){
        params.provider = providerId;
    }else{}
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/attributes`, params);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get all filters
 * @returns
 */
export const getAllFilterValuesRequest = (attributeCode, subCatName = null, providerId = null) => {
    let params = {
        attribute_code: attributeCode,
    };
    if(subCatName){
        let subCategoryName = subCatName.replace("And", "&");
        params.category = subCategoryName;
    }
    if(providerId){
        params.provider = providerId;
    }else{}
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/attributeValues`, params);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};