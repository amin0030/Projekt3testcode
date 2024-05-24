const sqlite3 = require('sqlite3').verbose();

// Create a new database in memory
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the in-memory SQLite database.');
  }
});

// Serialize database operations to ensure schema is ready before any data operations
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    tal INTEGER,
    farve TEXT,
    spiller TEXT,
    betAmount INTEGER,
    betType TEXT,
    vinder TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Error creating table', err.message);
    } else {
      console.log('Games table created or already exists.');
    }
  });
});

// Function to save a game result
function saveResult(tal, farve, spiller, betAmount, betType, vinder) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO games (tal, farve, spiller, betAmount, betType, vinder) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(tal, farve, spiller, betAmount, betType, vinder, function(error) {
      if (error) {
        console.error("Error inserting data", error);
        reject(error);
      } else {
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        resolve(this.lastID);
      }
    });
    stmt.finalize();
  });
}

// Function to fetch all game data
function getAllGameData() {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, tal, farve, spiller, betAmount, betType, vinder, timestamp FROM games ORDER BY timestamp DESC";

    db.all(query, (error, rows) => {
      if (error) {
        console.error("Error fetching all game data", error);
        reject(new Error("Failed to fetch all game data from database. Error: " + error.message));
      } else {
        console.log(`Fetched ${rows.length} games.`);
        resolve(rows);
      }
    });
  });
}

// Function to fetch all game results
function getGameData() {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, tal, farve, spiller, betAmount, betType, vinder, timestamp FROM games ORDER BY timestamp DESC", (error, rows) => {
      if (error) {
        console.error("Error fetching game data", error);
        reject(new Error("Failed to fetch game data from database. Error: " + error.message));
      } else {
        console.log(`Fetched ${rows.length} games.`);
        resolve(rows);
      }
    });
  });
}

// Function to fetch game data with winners only
function getGamesWithWinners() {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, tal, farve, spiller, betAmount, betType, vinder, timestamp FROM games WHERE vinder = 'Winner' ORDER BY timestamp DESC";

    db.all(query, (error, rows) => {
      if (error) {
        console.error("Error fetching game data with winners", error);
        reject(new Error("Failed to fetch game data with winners from database. Error: " + error.message));
      } else {
        console.log(`Fetched ${rows.length} games with winners.`);
        resolve(rows);
      }
    });
  });
}

// Function to clear all game results (for testing or resetting the database)
function clearResults() {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM games", function(error) {
      if (error) {
        console.error("Error clearing results", error);
        reject(error);
      } else {
        console.log(`Cleared all game results, ${this.changes} rows affected.`);
        resolve(this.changes);
      }
    });
  });
}

module.exports = {
  saveResult,
  getAllGameData,
  getGameData,
  getGamesWithWinners, 
  clearResults
};
