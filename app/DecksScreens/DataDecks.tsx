
import { db } from "../data/Database";



//READ DECKS
//create function to read data from the deck


export const getAllDecks = (currentLang) => {

  //define variable to hold array
  let deckNames = [];

  db.withTransactionSync(() => {

    const results = db.getAllSync(`SELECT * FROM deck WHERE language_id = ?;`, [currentLang]);
    deckNames = results.map(deck => deck.name);
  
  });

  return deckNames;

};
  
  
//CREATE DECK
//Function to create a new deck 
export const createNewDeck = (deckName, currentLang) => {

    db.withTransactionSync(() => {
      db.runSync(`INSERT INTO deck (name, bookmarked, language_id) VALUES (?, ?, ?);`, [deckName, 0, currentLang]);
    });

}
  

//UPDATE DECK


//DELETE DECK



//READ WORDS
//GET WORDS FROM A CERTAIN DECK
export const getWords = (currentLang, deckName) => {

  //define variable to hold array
  let wordsList = [];

  db.withTransactionSync(() => {
    const results = db.getAllSync(`SELECT * FROM word WHERE language_id = ? AND deck_id = ?;`, [currentLang, deckName]);
    wordsList = results.map(word => ({
      term: word.term,
      translation: word.translation,
      etymology: word.etymology,
      starred: word.starred,
    }));
    
  });

  return wordsList;

};


//CREATE WORD
export const createNewWord = (currentLang, deckName, term, translation, etymology) => {

  db.withTransactionSync(() => {
    db.runSync(`INSERT INTO word (term, translation, etymology, starred, deck_id, language_id) VALUES (?, ?, ?, ?, ?, ?);`, 
      [term, translation, etymology, false, deckName, currentLang]);
  });

}

//UPDATE WORD
export const updateWord = (currentLang, deckName, originalTerm, newTerm, translation, etymology) => {
  
  db.withTransactionSync(() => {
    db.runSync(`UPDATE word SET term = ?, translation = ?, etymology = ?
      WHERE term = ? AND deck_id = ? AND language_id = ?;`, 
      [newTerm, translation, etymology, originalTerm, deckName, currentLang]);
  });

}

//DELETE WORD
export const deleteWord = (currentLang, deckName, term) => {
  db.withTransactionSync(() => {
    db.runSync(
      `DELETE FROM word 
       WHERE term = ? AND deck_id = ? AND language_id = ?;`, 
      [term, deckName, currentLang]
    );
  });
};


//FUNCTION TO GET VALUE OF STARRED
export const getStarred = (currentLang, deckName, term) => {
  let starredValue;

  db.withTransactionSync(() => {
    starredValue = db.getFirstSync(
      `SELECT starred FROM word WHERE language_id = ? AND deck_id = ? AND term = ?;`,
      [currentLang, deckName, term]
    );
  });

  return starredValue ? starredValue.starred : 0; 
}

//FUNCTION TO TOGGLE A STAR
export const toggleStar = (currentLang, deckName, term) => {
  let newStarredValue;

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT starred FROM word WHERE language_id = ? AND deck_id = ? AND term = ?;`,
      [currentLang, deckName, term]
    );

    if (result) {
      newStarredValue = result.starred === 0 ? 1 : 0;
      db.runSync(
        `UPDATE word SET starred = ? WHERE language_id = ? AND deck_id = ? AND term = ?;`,
        [newStarredValue, currentLang, deckName, term]
      );
    }
  });


  return newStarredValue; 

};

//DECK BOOKMARKS
//Functionality to get bookmark status
// FUNCTION TO GET BOOKMARKED STATUS
export const getBookmarkedStatus = (currentLang, deckName) => {
  let bookmarkedStatus = 0; // Default to 0 if no result is found

  db.withTransactionSync(() => {
    const result = db.getFirstSync(
      `SELECT bookmarked FROM deck WHERE language_id = ? AND name = ?;`,
      [currentLang, deckName]
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
export const toggleBookmark = (currentLang, deckName) =>{
    // Get the current bookmark status (true if 1, false if 0)
    const isBookmarked = getBookmarkedStatus(currentLang, deckName);

    // Determine new status: if currently bookmarked (true), set to 0; if not (false), set to 1
    const newStatus = isBookmarked ? 0 : 1;

    // Update the database with the new bookmarked status
    db.withTransactionSync(() => {
      db.runSync(
        `UPDATE deck SET bookmarked = ? WHERE language_id = ? AND name = ?;`,
        [newStatus, currentLang, deckName]
      );
    });

}