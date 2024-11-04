import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";


//sqlite cheat sheet
    //function to delete
    //db.runSync(`DROP TABLE IF EXISTS general;`);

    //to add data and insert or replace
    // db.runSync(
    //     `INSERT OR REPLACE INTO general (id, current_language, user_languages)
    //     VALUES (1, 'French', '['Spanish', 'French']');`
    //   );

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

    // db.runSync(`INSERT INTO general (id, current_language) VALUES (1, 'French');`);

    // db.runSync(
    //   `INSERT INTO user_languages (language) VALUES (?);`,
    //   ['French']
    // );
  
    // db.runSync(
    //   `INSERT INTO user_languages (language) VALUES (?);`,
    //   ['Spanish']
    // );
  
    // db.runSync(
    //   `INSERT INTO user_languages (language) VALUES (?);`,
    //   ['German']
    // );
  

      // Create tables
      db.runSync(
        `CREATE TABLE IF NOT EXISTS general (
          id INTEGER PRIMARY KEY, 
          current_language TEXT NOT NULL
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS user_languages (
          id INTEGER PRIMARY KEY AUTOINCREMENT, 
          language TEXT NOT NULL
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS deck (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          bookmarked INTEGER NOT NULL,
          FOREIGN KEY(language_id) REFERENCES user_languages(id)
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS word (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          term TEXT NOT NULL,
          translation TEXT NOT NULL,
          etymology TEXT NOT NULL,
          starred INTEGER NOT NULL,
          deck_id INTEGER,
          FOREIGN KEY(deck_id) REFERENCES deck(id),
          FOREIGN KEY(language_id) REFERENCES user_languages(id)
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS tag (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          words TEXT NOT NULL,
          deck_id INTEGER,
          FOREIGN KEY(deck_id) REFERENCES deck(id),
          FOREIGN KEY(language_id) REFERENCES user_languages(id)
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS reader (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          interactive BOOLEAN,
          contents TEXT NOT NULL,
          reader_data TEXT NOT NULL,
          bookmarked BOOLEAN,
          FOREIGN KEY(language_id) REFERENCES user_languages(id)
        );`
      );

      db.runSync(
        `CREATE TABLE IF NOT EXISTS explorer (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          story_name TEXT NOT NULL,
          highlighted_words TEXT NOT NULL,
          bookmarked BOOLEAN,
          FOREIGN KEY(language_id) REFERENCES user_languages(id)
        );`
      );
    });

    return db;
}
  
//export the database constant
export const db = openDatabase();

