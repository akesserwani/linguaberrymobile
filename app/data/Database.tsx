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
          language TEXT NOT NULL,
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
          etymology TEXT NOT NULL,
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
        `CREATE TABLE IF NOT EXISTS entry (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          contents TEXT NOT NULL,
          word_data TEXT,
          translation_data TEXT,
          bookmarked BOOLEAN,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
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
    // db.runSync(`DROP TABLE IF EXISTS general;`);
    // db.runSync(`DROP TABLE IF EXISTS user_languages;`);
    // db.runSync(`DROP TABLE IF EXISTS deck;`);
    // db.runSync(`DROP TABLE IF EXISTS word;`);
    // db.runSync(`DROP TABLE IF EXISTS tag;`);
    // db.runSync(`DROP TABLE IF EXISTS entry;`);


  // Insert initial data into the general table
  // db.runSync(
  //   `INSERT OR IGNORE INTO general (id, current_language) VALUES (1, 'French');`
  // );

  // // Insert initial data into the user_languages table
  // db.runSync(
  //   `INSERT OR IGNORE INTO user_languages (language) VALUES ('French');`
  // );

  // db.runSync(
  //   `INSERT OR IGNORE INTO user_languages (language) VALUES ('Spanish');`
  // );

//   // Add more initial data here as needed...



}

//export the database constant
export const db = openDatabase();

