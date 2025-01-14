import { db } from "@/app/data/Database";

import CustomAlert from "@/app/components/CustomAlert";

//Functions for the reader 

//create a new reader entry
export const newEntry = (title, current_language) =>{
    db.withTransactionSync(() => {
        db.runSync(
            `INSERT INTO story (title, contents, word_data, translation_data, bookmarked, tag, language_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                title, "", "", "", 0, "none", current_language);
    });
}


//view all entries based on language 
export const getEntriesByLanguage = (language_id) => {
    let entries = [];
    
    db.withTransactionSync(() => {
        entries = db.getAllSync(
            `SELECT * FROM story WHERE language_id = ?`,
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
            `SELECT contents FROM story WHERE id = ? AND language_id = ?`,
            entryId,
            languageId
        );

        content = result?.contents || "";
    });

    return content;
};

// Function to delete an entry based on its ID
export const deleteEntry = (entryId, language_id) => {
    db.withTransactionSync(() => {
        db.runSync(
            `DELETE FROM story WHERE id = ? AND language_id = ?`,
            entryId,
            language_id
        );
    });
};

// Function to update the entry in the database
export const updateEntry = (entryId, title, contents) => {
    db.withTransactionSync(() => {
        db.runSync(
            `UPDATE story SET title = ?, contents = ? WHERE id = ?`,
            title, contents, entryId
        );
    });
};

// Function to get all data of an entry by its ID and language_id
export const getSingleEntryData = (entryId, languageId) => {
    let entryData = null;

    db.withTransactionSync(() => {
        const result = db.getFirstSync(
            `SELECT * FROM story WHERE id = ? AND language_id = ?`,
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
        `SELECT bookmarked FROM story WHERE language_id = ? AND id = ?;`,
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
          `UPDATE story SET bookmarked = ? WHERE language_id = ? AND id = ?;`,
          [newStatus, currentLang, entryId]
        );
      });
  }
  
export const getWordData = (entryId, currentLang) => {
    let wordData = null;

    db.withTransactionSync(() => {
        const result = db.getFirstSync(
            `SELECT word_data FROM story WHERE id = ? AND language_id = ?`,
            entryId, currentLang
        );
        wordData = result?.word_data ? JSON.parse(result.word_data) : []; // Parse the JSON string, or return an empty array if null
    });

    return wordData;
};

export const updateWordData = (newWordData, entryId, currentLang) => {
    try {
        db.withTransactionSync(() => {
            db.runSync(
                `UPDATE story SET word_data = ? WHERE id = ? AND language_id = ?`,
                JSON.stringify(newWordData), // Convert the data to a JSON string
                entryId,
                currentLang
            );
        });
        console.log("Word data updated successfully!");
    } catch (error) {
        console.error("Error updating word data:", error.message);
    }
};

//function to get translation data
export const getTranslationData = (entryId, currentLang) => {
    let translationData = "";

    try {
        db.withTransactionSync(() => {
            const result = db.getFirstSync(
                `SELECT translation_data FROM story WHERE id = ? AND language_id = ?`,
                entryId,
                currentLang
            );

            // Ensure `translation_data` is a string, or fallback to an empty string
            translationData = result?.translation_data || "";
        });
    } catch (error) {
        console.error("Error fetching translation data:", error.message);
        translationData = ""; // Fallback to default value
    }

    return translationData;
};

//function to get translation data
export const updateTranslationData = (translationData, entryId, currentLang) => {
    try {
        db.withTransactionSync(() => {
            db.runSync(
                `UPDATE story SET translation_data = ? WHERE id = ? AND language_id = ?`,
                translationData, // Directly store the string
                entryId,
                currentLang
            );
        });
        console.log("Translation data updated successfully!");
    } catch (error) {
        console.error("Error updating translation data:", error.message);
    }
};


//Get all the entry_tags
export const getAllReaderTags = (currentLang) =>{
    let data = [];

    db.withTransactionSync(() => {
        const results = db.getAllSync(`SELECT id, name FROM story_tag WHERE language_id = ?`, [currentLang]);
        data = results || []; // Fallback to an empty array if no results
    });

    return data;
}



// Create a new entry tag if it does not already exist
export const createNewTag = (name, currentLang) => {
    let tagCreated = false; // Variable to capture result

    db.withTransactionSync(() => {
        // Check if the tag already exists
        const result = db.getFirstSync(
            `SELECT id FROM story_tag WHERE name = ? AND language_id = ?`, 
            [name, currentLang]
        );

        // If the result is null, the tag does not exist, so create it
        if (!result) {
            db.runSync(
                `INSERT INTO story_tag (name, language_id) VALUES (?, ?)`, 
                [name, currentLang]
            );
            tagCreated = true; // Tag was created
        } else {
            console.log(`Tag "${name}" already exists for language ID ${currentLang}.`);
        }
    });

    return tagCreated; // Return the result outside the transaction
};

//delete an entry tag
export const deleteTagByName = (tagName, currentLang) => {
    try {
        db.withTransactionSync(() => {
            // Execute the delete query
            db.runSync(
                `DELETE FROM story_tag WHERE name = ? AND language_id = ?;`, 
                [tagName, currentLang]
            );
            console.log(`Tag "${tagName}" deleted successfully.`);
        });
    } catch (error) {
        console.log(`Failed to delete tag "${tagName}":`, error);
    }
}

//Update a tag to a story
export const updateTagInStory = (newTag, entryId, currentLang) => {
    try {
        db.withTransactionSync(() => {
            db.runSync(
                `UPDATE story 
                 SET tag = ? 
                 WHERE id = ? AND language_id = ?;`,
                [newTag, entryId, currentLang]
            );
        });
        console.log(`Tag successfully updated for entry with ID: ${entryId}`);
    } catch (error) {
        console.error("Error updating tag in story:", error);
    }
};

//get tag of a certain story
// Get the tag of a specific story
export const getTagOfStory = (entryId, currentLang) => {
    try {
        let tag = null; // Variable to store the retrieved tag
        db.withTransactionSync(() => {
            const result = db.getFirstSync(
                `SELECT tag 
                 FROM story 
                 WHERE id = ? AND language_id = ?;`,
                [entryId, currentLang]
            );
            tag = result ? result.tag : null; // Check if result exists
        });
        console.log(`Tag retrieved for entry with ID: ${entryId} - Tag: ${tag}`);
        return tag;
    } catch (error) {
        console.error("Error fetching tag of story:", error);
        return null; // Return null if an error occurs
    }
};


//Creating a new entry with full data
//create a new reader entry

//function to convert the CSV data from the text into the official format, derived from CSVToObject
const formatWordDataFromWeb = (data) => {
    // Split the data into rows using the correct line break format
    const rows = data.split(/\\r\\n/);

    // Define the default headers in the expected order
    const defaultHeaders = ['term', 'translation', 'notes'];

    // Map the rows to objects using the default header order
    const result = rows.map(row => {
        const values = row.split(',').map(value => value.trim()); // Split by commas and trim spaces

        // Create an object for each row
        const object = {};
        defaultHeaders.forEach((header, index) => {
            const value = values[index] ? values[index].replace(/^"|"$/g, '').replace(/""/g, '"') : '';
            object[header] = header === 'notes' && !value ? 'none' : value; // Set "none" if notes is empty
        });

        return object;
    }).filter(obj => obj.term && obj.translation); // Filter out rows without a valid term or translation

    return JSON.stringify(result, null, 2); // Serialize the array of objects to a pretty-printed JSON string
};



export const newEntryFull = ( 
    title, 
    contents = "", 
    word_data = "", 
    translation_data = "", 
    current_language 
    ) => {

        try{
            const formattedWordData = formatWordDataFromWeb(word_data);
            console.log(word_data)
            db.withTransactionSync(() => {
                db.runSync(
                    `INSERT INTO story (title, contents, word_data, translation_data, bookmarked, tag, language_id) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [title, contents, formattedWordData, translation_data, 0, "none", current_language] // Pass parameters as an array
                );
            });
        }
        catch (error) {
            CustomAlert("Error! This story could not be added.")
        }
};

