

import { db } from "@/app/data/Database";

//functionality to CRUD the data for the languages

//READ
//functionality to get current language
export const getCurrentLangStorage = () =>{
    let currentLanguage = "";

    db.withTransactionSync(() => {
        const result = db.getFirstSync("SELECT current_language FROM general WHERE id = 1;");
        currentLanguage = result.current_language;
    });
    return currentLanguage; // Return the captured value
}

//UPDATE
//functionality to set a current language
export const setCurrentLangStorage = (language) =>{

    db.withTransactionSync(() => {
        const result = db.runSync(
        `UPDATE general SET current_language = ? WHERE id = 1;`, 
        [language]);
    });

}


//UPDATE
//FUNCTIONALITY TO UPDATE THE LANGUAGE STORAGE BASED ON WHETHER A LANGUAGE IS ADDED OR DELETED
export const getLangStorage = () => {
        let languages = [];

        db.withTransactionSync(() => {
            const results = db.getAllSync("SELECT * FROM user_languages;");
        
            // Map the result rows to an array
            languages = results.map(row => row.language);
        });
    
        return languages;
  
  };
  
//ADD LANGUAGE
//FUNCTIONALITY TO UPDATE THE LANGUAGE STORAGE BASED ON WHETHER A LANGUAGE IS ADDED OR DELETED
export const addLangStorage = (language) => {
    db.withTransactionSync(() => {
        db.runSync(`INSERT INTO user_languages (language) VALUES (?);`,[language]);
    });

}

//DELETE LANGUAGE
//FUNCTIONALITY TO UPDATE THE LANGUAGE STORAGE BASED ON WHETHER A LANGUAGE IS ADDED OR DELETED
export const deleteLangStorage = (language) => {
    db.withTransactionSync(() => {
        db.runSync(`DELETE FROM user_languages WHERE language = ?;`, [language]);
    });
}

