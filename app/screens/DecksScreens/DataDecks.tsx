
import { db } from "../../data/Database";

import CustomAlert from "@/app/components/CustomAlert";

//READ DECKS
//create function to read data from the deck

export const getAllDecks = (currentLang) => {
  let deckData = [];

  db.withTransactionSync(() => {
    const results = db.getAllSync(
      `SELECT d.id, d.name, d.bookmarked, COUNT(w.id) AS word_count
       FROM deck d
       LEFT JOIN word w ON d.id = w.deck_id
       WHERE d.language_id = ?
       GROUP BY d.id, d.name, d.bookmarked;`,
      [currentLang]
    );
    
    // Map results to an array of objects with id, name, bookmarked, and word_count
    deckData = results.map(deck => ({
      id: deck.id,
      name: deck.name,
      bookmarked: deck.bookmarked,
      word_count: deck.word_count
    }));
  });

  return deckData;
};


  
// Get the name of a deck based on its ID
export const getDeckName = (currentLang, deckId) => {
  let deckName = null;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT name FROM deck WHERE language_id = ? AND id = ?;`,
      [currentLang, deckId]
    );

    // Check if a result was returned and set the deckName
    if (result) {
      deckName = result.name;
    }
  });

  return deckName;
};


//CHECK IF DECK NAME ALREADY EXISTS
export const deckNameExist = (deckName, currentLang) => {
  let exists = false;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT id FROM deck WHERE name = ? AND language_id = ?;`,
      [deckName, currentLang]
    );

    // If a result is found, set exists to true
    if (result) {
      exists = true;
    }
  });

  return exists;
};
  
//CREATE DECK
//Function to create a new deck 
export const createNewDeck = (deckName, currentLang) => {

    db.withTransactionSync(() => {
      db.runSync(`INSERT INTO deck (name, bookmarked, language_id) VALUES (?, ?, ?);`, [deckName, 0, currentLang]);
      
    });

}
  

//UPDATE DECK
export const updateDeck = (currentLang, deckId, newDeckName) =>{
  db.withTransactionSync(() => {
    db.runSync(
      `UPDATE deck 
       SET name = ?
       WHERE language_id = ? AND id = ?;`,
      [newDeckName, currentLang, deckId]
    );
  });
}

//DELETE DECK
export const deleteDeck = (currentLang, deckId) => {
  db.withTransactionSync(() => {

    //delete all corresponding data
    // Delete all words associated with the deck
    db.runSync(
      `DELETE FROM word 
        WHERE deck_id = ? AND language_id = ?;`,
      [deckId, currentLang]
    );

    // Delete all tags associated with the deck
    db.runSync(
      `DELETE FROM tag 
        WHERE deck_id = ? AND language_id = ?;`,
      [deckId, currentLang]
    );
  

      //Finally delete the language itself
      db.runSync(
        `DELETE FROM deck 
         WHERE language_id = ? AND id = ?;`,
        [currentLang, deckId]
      );
  
  });
};



//READ WORDS
//GET WORDS FROM A CERTAIN DECK
export const getWords = (currentLang, deckId) => {

  //define variable to hold array
  let wordsList = [];

  db.withTransactionSync(() => {
    const results = db.getAllSync(`SELECT * FROM word WHERE language_id = ? AND deck_id = ?;`, [currentLang, deckId]);
    wordsList = results.map(word => ({
      term: word.term,
      translation: word.translation,
      notes: word.notes,
      starred: word.starred,
      tag: word.tag,
    }));
    
  });

  return wordsList;

};


//CREATE WORD
export const createNewWord = (  term, translation, notes, tag, deckId, currentLang) => {

  db.withTransactionSync(() => {
    db.runSync(`INSERT INTO word (term, translation, notes, tag, starred, deck_id, language_id) VALUES (?, ?, ?, ?, ?, ?, ?);`, 
      [term, translation, notes, tag, false, deckId, currentLang]);
  });

}

// Function to insert multiple words into the database as objects, skipping duplicates
export const createBulkWords = (words, deck_id, language_id) => {
  try {
    db.withTransactionSync(() => {
      // Step 1: Delete all existing words in the specified deck and language
      db.runSync(
        `DELETE FROM word WHERE deck_id = ? AND language_id = ?;`,
        [deck_id, language_id]
      );

      // Step 2: Insert the new words from the words array
      words.forEach(word => {
        const { term, translation, notes } = word;

        db.runSync(
          `INSERT INTO word (term, translation, notes, tag, starred, deck_id, language_id)
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [term, translation, notes, "None", 0, deck_id, language_id]
        );
      });
    });
    return true;

  } catch (error) {
    return false;
  }
};



export const createBulkWordsByDeckName = (deckName, words, language_id) => {
  try {
    db.withTransactionSync(() => {
      // Step 1: Get the deck ID by its name
      const result = db.getFirstSync(
        `SELECT id FROM deck WHERE name = ? AND language_id = ? LIMIT 1;`,
        [deckName, language_id]
      );

      if (result.length === 0) {
        throw new Error(`Deck with name "${deckName}" not found.`);
      }

      const deck_id = result.id; // Fetch the deck ID

      // Step 2: Insert each word into the database
      words.forEach(word => {
        const { term, translation, notes } = word;

        db.runSync(
          `INSERT OR IGNORE INTO word (term, translation, notes, tag, starred, deck_id, language_id)
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [term, translation, notes || "None", "None", 0, deck_id, language_id]
        );
      });
    });

    return true; // Success
  } catch (error) {
    console.error("Error in createBulkWordsByDeckName:", error.message);
    return false; // Failure
  }
};


//UPDATE WORD
export const updateWord = (currentLang, deckId, originalTerm, newTerm, translation, notes) => {
  
  db.withTransactionSync(() => {
    db.runSync(`UPDATE word SET term = ?, translation = ?, notes = ?
      WHERE term = ? AND deck_id = ? AND language_id = ?;`, 
      [newTerm, translation, notes, originalTerm, deckId, currentLang]);
  });

}

//DELETE WORD
export const deleteWord = (currentLang, deckId, term) => {
  db.withTransactionSync(() => {
    db.runSync(
      `DELETE FROM word 
       WHERE term = ? AND deck_id = ? AND language_id = ?;`, 
      [term, deckId, currentLang]
    );
  });
};

//CHECK IF WORD EXISTS IN A DECK
export const wordExistsInDeck = (currentLang, deckId, term) => {
  let exists = false;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT 1 FROM word WHERE term = ? AND deck_id = ? AND language_id = ?;`,
      [term, deckId, currentLang]
    );

    // If result is found, set exists to true
    if (result) {
      exists = true;
    }
  });

  return exists;
};


//FUNCTION TO GET VALUE OF STARRED
export const getStarred = (currentLang, deckId, term) => {
  let starredValue;

  db.withTransactionSync(() => {
    starredValue = db.getFirstSync(
      `SELECT starred FROM word WHERE language_id = ? AND deck_id = ? AND term = ?;`,
      [currentLang, deckId, term]
    );
  });

  return starredValue ? starredValue.starred : 0; 
}

//FUNCTION TO TOGGLE A STAR
export const toggleStar = (currentLang, deckId, term) => {
  let newStarredValue;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT starred FROM word WHERE language_id = ? AND deck_id = ? AND term = ?;`,
      [currentLang, deckId, term]
    );

    if (result) {
      newStarredValue = result.starred === 0 ? 1 : 0;
      db.runSync(
        `UPDATE word SET starred = ? WHERE language_id = ? AND deck_id = ? AND term = ?;`,
        [newStarredValue, currentLang, deckId, term]
      );
    }
  });


  return newStarredValue; 

};

//DECK BOOKMARKS
//Functionality to get bookmark status
// FUNCTION TO GET BOOKMARKED STATUS
export const getBookmarkedStatus = (currentLang, deckId) => {
  let bookmarkedStatus = 0; // Default to 0 if no result is found

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT bookmarked FROM deck WHERE language_id = ? AND id = ?;`,
      [currentLang, deckId]
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
export const toggleBookmark = (currentLang, deckId) =>{
    // Get the current bookmark status (true if 1, false if 0)
    const isBookmarked = getBookmarkedStatus(currentLang, deckId);

    // Determine new status: if currently bookmarked (true), set to 0; if not (false), set to 1
    const newStatus = isBookmarked ? 0 : 1;

    // Update the database with the new bookmarked status
    db.withTransactionSync(() => {
      db.runSync(
        `UPDATE deck SET bookmarked = ? WHERE language_id = ? AND id = ?;`,
        [newStatus, currentLang, deckId]
      );
    });

}


//TAG CRUD
//GET ALL THE TAGS
export const getAllTagsInDeck = (deck_id, language_id) => {
  let tags = [];

  db.withTransactionSync(() => {
    const results = db.getAllSync(
      `SELECT id, name FROM tag WHERE deck_id = ? AND language_id = ?;`,
      [deck_id, language_id]
    );

    // Map the results to an array of tag objects
    tags = results.map(row => ({
      id: row.id,
      name: row.name
    }));
  });

  return tags;
};



//CHECK IF TAG ALREADY EXISTS IN THE DECK
export const tagExistsInDeck = (name, deck_id, language_id) => {
  let exists = false;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT 1 FROM tag WHERE name = ? AND deck_id = ? AND language_id = ?;`,
      [name, deck_id, language_id]
    );

    // If a result is found, set exists to true
    if (result) {
      exists = true;
    }
  });

  return exists;
};

//CREATE A TAG
export const createTag = (name, deck_id, language_id) => {
    db.withTransactionSync(() => {
      db.runSync(
        `INSERT INTO tag (name, deck_id, language_id)
         VALUES (?, ?, ?);`,
        [name, deck_id, language_id]
      );
    });
};



//DELETE A TAG
// Function to delete a tag by name, deck_id, and language_id
export const deleteTagByName = (name, deck_id, language_id) => {
    db.withTransactionSync(() => {
      //Delete the tag
      db.runSync(
        `DELETE FROM tag WHERE name = ? AND deck_id = ? AND language_id = ?;`,
        [name, deck_id, language_id]
      );

      // Update the `tag` field in `word` table to "None" for words that had the deleted tag
      db.runSync(
        `UPDATE word SET tag = 'None' WHERE tag = ? AND deck_id = ? AND language_id = ?;`,
        [name, deck_id, language_id]
      );
    });
};


//GET TAG OF A WORD
// Function to get the tag of a word by term, deck_id, and language_id
export const getTagOfWord = (term, deck_id, language_id) => {
  let tag = null;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT tag FROM word WHERE term = ? AND deck_id = ? AND language_id = ?;`,
      [term, deck_id, language_id]
    );

    // If the result is found, assign the tag
    if (result) {
      tag = result.tag;
    }
  });

  return tag;
};


//UPDATE TAG OF WORD
export const updateWordTag = (term, newTag, deck_id, language_id) => {
  db.withTransactionSync(() => {
    db.runSync(
      `UPDATE word
       SET tag = ?
       WHERE term = ? AND deck_id = ? AND language_id = ?;`,
      [newTag, term, deck_id, language_id]
    );
  });
};

//GET ALL THE WORDS IN A DECK THAT HAVE A CERTAIN TAG
export const getWordsWithTag = (tag, deck_id, language_id) => {
  let words = [];

  db.withTransactionSync(() => {
    const results = db.getAllSync(
      `SELECT * FROM word WHERE tag = ? AND deck_id = ? AND language_id = ?;`,
      [tag, deck_id, language_id]
    );

    // Map results to an array of word objects
    words = results.map(row => ({
      id: row.id,
      term: row.term,
      translation: row.translation,
      notes: row.notes,
      tag: row.tag,
      starred: row.starred,
    }));
  });

  return words;
};




//this function will convert the data from the api into a readable format by the bulk word importer
const parseTextToWords = (text) => {
  return text
    .split("\n") // Split lines
    .map(line => {
      const parts = line.split(","); // Split by comma
      if (parts.length < 2) {
        throw new Error(`Invalid format in line: "${line}"`);
      }

      return {
        term: parts[0].trim(),
        translation: parts[1].trim(),
        notes: parts[2]?.trim() || "None", // Default to "None" if notes are missing
      };
    });
};


//this function will grab the data from the api and add it to the decks 
export const addWebDataToDeck = (currentLang, data) =>{

  //first make sure the deck name doesnt already exist
  if (deckNameExist(data.title, currentLang)){
    //render an alert to show that the deck name already exists in this language
    CustomAlert("This deck name already exists.", "Rename the existing deck to add this deck.")
    console.log(data.data)
  } else{ 
    //if it doesnt, create the deck
    createNewDeck(data.title, currentLang);
    //then add bulk words by deck name
    const words = parseTextToWords(data.data);
    createBulkWordsByDeckName(data.title, words, currentLang);
    
    //render a success alert
    CustomAlert("Deck successfully added!")

  }




}