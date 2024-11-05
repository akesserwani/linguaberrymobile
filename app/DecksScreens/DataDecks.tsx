
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

//UPDATE WORD
// export const updateWord = (currentLang, deckName, term, translation, etymology) => {
  
//   db.withTransactionSync(() => {
//     db.runSync(`INSERT INTO word (term, translation, etymology, starred, deck_id, language_id) VALUES (?, ?, ?, ?, ?, ?);`, 
//       [term, translation, etymology, false, deckName, currentLang]);
//   });

// }