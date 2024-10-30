
import { storage } from "@/app/data/Database"

//functionality to CRUD the data for the languages

//READ
//functionality to get current language
export const getCurrentLangStorage = () =>{
    return storage.getString("general_currentLanguage");
}

//UPDATE
//functionality to set a current language
export const setCurrentLangStorage = (language) =>{
    storage.set("general_currentLanguage", language);
}




//UPDATE
//FUNCTIONALITY TO UPDATE THE LANGUAGE STORAGE BASED ON WHETHER A LANGUAGE IS ADDED OR DELETED
export const getLangStorage = () => {
    const storedLanguages = storage.getString("general_userLanguages");
    //if it does not exist then return an empty JSON array
    return storedLanguages ? JSON.parse(storedLanguages) : [];
  };
  
//UPDATE
//FUNCTIONALITY TO UPDATE THE LANGUAGE STORAGE BASED ON WHETHER A LANGUAGE IS ADDED OR DELETED
export const setLangStorage = (languages) => {
    storage.set("general_userLanguages", JSON.stringify(languages));
}

