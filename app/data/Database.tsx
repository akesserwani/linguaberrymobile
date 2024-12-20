import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";





function openDatabase() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabaseSync("db.db");


    //create table 
    db.withTransactionSync(() => {
      // // Insert initial data into the general table
      // db.runSync(`DROP TABLE IF EXISTS general;`);
      // db.runSync(`DROP TABLE IF EXISTS user_languages;`);
      // db.runSync(`DROP TABLE IF EXISTS deck;`);
      // db.runSync(`DROP TABLE IF EXISTS word;`);
      // db.runSync(`DROP TABLE IF EXISTS tag;`);
      // db.runSync(`DROP TABLE IF EXISTS story;`);
      // db.runSync(`DROP TABLE IF EXISTS story_tag;`);
      // db.runSync(`DROP TABLE IF EXISTS explorer;`);
  
      // Create tables
      db.runSync(
        `CREATE TABLE IF NOT EXISTS general (
          id INTEGER PRIMARY KEY, 
          current_language TEXT NOT NULL,
          onboarding INTEGER DEFAULT 0
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS user_languages (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          language TEXT NOT NULL UNIQUE,          
          direction TEXT NOT NULL
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS deck (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          bookmarked INTEGER NOT NULL,
          language_id INTEGER,
          FOREIGN KEY(language_id) REFERENCES user_languages(id) ON DELETE CASCADE
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS word (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          term TEXT NOT NULL,
          translation TEXT NOT NULL,
          notes TEXT NOT NULL,
          tag TEXT,
          starred INTEGER NOT NULL,
          deck_id INTEGER,
          language_id INTEGER,
          FOREIGN KEY(deck_id) REFERENCES deck(id) ON DELETE CASCADE,
          FOREIGN KEY(language_id) REFERENCES user_languages(id) ON DELETE CASCADE
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS tag (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          deck_id INTEGER,
          language_id INTEGER,
          FOREIGN KEY(deck_id) REFERENCES deck(id) ON DELETE CASCADE,
          FOREIGN KEY(language_id) REFERENCES user_languages(id) ON DELETE CASCADE
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS story (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          contents TEXT NOT NULL,
          word_data TEXT,
          translation_data TEXT,
          bookmarked BOOLEAN,
          tag TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
          language_id INTEGER,
          FOREIGN KEY(language_id) REFERENCES user_languages(id) ON DELETE CASCADE
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS story_tag (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          language_id INTEGER,
          FOREIGN KEY(language_id) REFERENCES user_languages(id) ON DELETE CASCADE
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS explorer (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          story_name TEXT NOT NULL,
          highlighted_words TEXT NOT NULL,
          bookmarked BOOLEAN,
          language_id INTEGER,
          FOREIGN KEY(language_id) REFERENCES user_languages(id) ON DELETE CASCADE
        );`
      );

      pushInitialData(db);

    });

    return db;
}
  

function pushInitialData(db) {
    
  //check to see if the onboarding variable is 0
  //if it is 0 then we will add languages and change it to 1
  let result = db.getFirstSync(`SELECT onboarding FROM general WHERE id = 1;`);

  if (result?.onboarding === 0 || !result){
    //Add Spanish and French languages
    db.runSync(
      `INSERT OR IGNORE INTO user_languages (language, direction) VALUES ('French', 'LTR');`
    );

    db.runSync(
      `INSERT OR IGNORE INTO user_languages (language, direction) VALUES ('Spanish', 'LTR');`
    );

    //Set Spanish as current language and onboarding to 1 so it does not reactivate
    db.runSync(
      `INSERT OR IGNORE INTO general (id, current_language, onboarding) VALUES (1, 'Spanish', 0);`
    );

  }

}

//export the database constant
export const db = openDatabase();

