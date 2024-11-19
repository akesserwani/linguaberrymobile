import { db } from "@/app/data/Database";

//Functions for the reader 

//create a new reader entry
export const newEntry = (title, current_language) =>{
    db.withTransactionSync(() => {
        db.runSync(
            `INSERT INTO entry (title, contents, word_data, sentence_data, bookmarked, language_id) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                title, "", "", "", 0, current_language);
    });
}


//view all entries based on language 
export const getEntriesByLanguage = (language_id) => {
    let entries = [];
    
    db.withTransactionSync(() => {
        entries = db.getAllSync(
            `SELECT * FROM entry WHERE language_id = ?`,
            language_id
        );
    });
    
    return entries;
};

//function to get the contents of an entry by specifying language and id 
export const getEntryContents = (entryId, languageId) => {
    let content = "";

    db.withTransactionSync(() => {
        const result = db.getFirstSync(
            `SELECT contents FROM entry WHERE id = ? AND language_id = ?`,
            entryId,
            languageId
        );

        content = result.contents;
    });

    return content;
};

// Function to delete an entry based on its ID
export const deleteEntry = (entryId, language_id) => {
    db.withTransactionSync(() => {
        db.runSync(
            `DELETE FROM entry WHERE id = ? AND language_id = ?`,
            entryId,
            language_id
        );
    });
};

// Function to update the entry in the database
export const updateEntry = (entryId, title, contents) => {
    db.withTransactionSync(() => {
        db.runSync(
            `UPDATE entry SET title = ?, contents = ? WHERE id = ?`,
            title, contents, entryId
        );
    });
};

// Function to get all data of an entry by its ID and language_id
export const getSingleEntryData = (entryId, languageId) => {
    let entryData = null;

    db.withTransactionSync(() => {
        const result = db.getFirstSync(
            `SELECT * FROM entry WHERE id = ? AND language_id = ?`,
            entryId,
            languageId
        );

        if (result) {
            entryData = result;
        }
    });

    return entryData;
};

//Entry BOOKMARKS
//Functionality to get bookmark status
// FUNCTION TO GET BOOKMARKED STATUS
export const getBookmarkedStatus = (currentLang, entryId) => {
    let bookmarkedStatus = 0; // Default to 0 if no result is found
  
    db.withTransactionSync(() => {
      const result = db.getFirstSync(
        `SELECT bookmarked FROM entry WHERE language_id = ? AND id = ?;`,
        [currentLang, entryId]
      );
  
      // Check if result is not null/undefined before accessing bookmarked
      if (result) {
        bookmarkedStatus = result.bookmarked;
      }
    });
  
    // Return true if bookmarkedStatus is 1, otherwise false
    return bookmarkedStatus === 1;
  };
  
  //function to toggle bookmark
  export const toggleBookmark = (currentLang, entryId) =>{
      // Get the current bookmark status (true if 1, false if 0)
      const isBookmarked = getBookmarkedStatus(currentLang, entryId);
  
      // Determine new status: if currently bookmarked (true), set to 0; if not (false), set to 1
      const newStatus = isBookmarked ? 0 : 1;
  
      // Update the database with the new bookmarked status
      db.withTransactionSync(() => {
        db.runSync(
          `UPDATE entry SET bookmarked = ? WHERE language_id = ? AND id = ?;`,
          [newStatus, currentLang, entryId]
        );
      });
  }
  
export const getWordData = (entryId, currentLang) => {
    let wordData = null;

    db.withTransactionSync(() => {
        wordData = db.getFirstSync(
            `SELECT word_data FROM entry WHERE id = ? AND language_id = ?`,
            entryId, currentLang
        );
    });

    return wordData ? wordData.word_data : null; 
};

export const updateWordData = (newWordData, entryId, currentLang) => {
    db.withTransactionSync(() => {
        db.runSync(
            `UPDATE entry SET word_data = ? WHERE id = ? AND language_id = ?`,
            newWordData, entryId, currentLang
        );
    });
};
