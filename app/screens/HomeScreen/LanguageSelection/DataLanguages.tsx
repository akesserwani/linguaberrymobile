

import { db } from "@/app/data/Database";

//functionality to CRUD the data for the languages

//READ
//functionality to get current language
export const getCurrentLangStorage = () =>{
    let currentLanguage = "";

    db.withTransactionSync(() => {
        const result = db.getFirstSync("SELECT current_language FROM general WHERE id = 1;");
        currentLanguage = result?.current_language || "";
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
export const addLangStorage = (language, direction) => {
    db.withTransactionSync(() => {
        db.runSync(`INSERT INTO user_languages (language, direction) VALUES (?, ?);`,[language, direction]);
    });

}

//DELETE LANGUAGE
//FUNCTIONALITY TO UPDATE THE LANGUAGE STORAGE BASED ON WHETHER A LANGUAGE IS ADDED OR DELETED
export const deleteLangStorage = (language) => {
    db.withTransactionSync(() => {

        //Delete all bound data
        //Delete deck data
        db.runSync(`DELETE FROM deck WHERE language_id = ?;`, [language]);
        //Delete word data
        db.runSync(`DELETE FROM word WHERE language_id = ?;`, [language]);
        //Delete tag data
        db.runSync(`DELETE FROM tag WHERE language_id = ?;`, [language]);
        //Delete entry data
        db.runSync(`DELETE FROM story WHERE language_id = ?;`, [language]);
        //Delete explorer data
        db.runSync(`DELETE FROM explorer WHERE language_id = ?;`, [language]);

        //Delete the story tags 
        db.runSync(`DELETE FROM story_tag WHERE language_id = ?;`, [language]);

        //Finally Delete the language itself
        db.runSync(`DELETE FROM user_languages WHERE language = ?;`, [language]);

    });
}


//get language direction 
//check to see if it is LTR or RTL
export const isLanguageRTL = (language) => {
    let isRTL = false; // Default to false for non-RTL languages

    db.withTransactionSync(() => {
        const result = db.getFirstSync(
            `SELECT direction FROM user_languages WHERE language = ?;`,
            [language]
        );


        if (result && result.direction === "RTL") {
            isRTL = true; // Set to true if the direction is "RTL"
        }
    });

    return isRTL;
};
