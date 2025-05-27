// src/utils/firebaseBackup.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

/**
 * Firebase Backup Utility
 *
 * This utility provides functions to backup and restore Firestore data
 * Run this script using Node.js (not in the browser)
 *
 * Usage:
 *   - Configure your serviceAccountKey.json
 *   - Set the BACKUP_PATH to your desired backup location
 *   - Run with Node.js: node -r esm firebaseBackup.js
 */

// Configuration - adjust these values
const BACKUP_PATH = "./backups";
const COLLECTIONS_TO_BACKUP = ["customers", "jobs"]; // Add all collections you want to backup
const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json"; // Path to your Firebase service account key

// Initialize Firebase Admin with service account
let app;
let db;

/**
 * Initialize Firebase Admin SDK
 */
const initializeFirebaseAdmin = () => {
  try {
    const serviceAccount = JSON.parse(
      fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8")
    );

    app = initializeApp({
      credential: cert(serviceAccount),
    });

    db = getFirestore();
    console.log("Firebase Admin initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    return false;
  }
};

/**
 * Create a backup of specified Firestore collections
 * @param {Array<string>} collections - Array of collection names to backup
 * @returns {Promise<string>} Path to the backup directory
 */
export const createBackup = async (collections = COLLECTIONS_TO_BACKUP) => {
  // Initialize Firebase Admin if not already initialized
  if (!db && !initializeFirebaseAdmin()) {
    throw new Error("Failed to initialize Firebase Admin");
  }

  try {
    // Create backup directory with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const backupDir = path.join(BACKUP_PATH, `backup-${timestamp}`);

    // Create directory if it doesn't exist
    if (!fs.existsSync(BACKUP_PATH)) {
      fs.mkdirSync(BACKUP_PATH, { recursive: true });
    }

    fs.mkdirSync(backupDir);

    // Process each collection
    for (const collectionName of collections) {
      console.log(`Backing up collection: ${collectionName}`);

      // Get all documents in the collection
      const snapshot = await db.collection(collectionName).get();

      if (snapshot.empty) {
        console.log(`No documents found in collection: ${collectionName}`);
        continue;
      }

      // Create array of document data
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Write to JSON file
      const filePath = path.join(backupDir, `${collectionName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

      console.log(
        `Backed up ${documents.length} documents from ${collectionName}`
      );
    }

    // Create a backup info file
    const infoPath = path.join(backupDir, "backup-info.json");
    fs.writeFileSync(
      infoPath,
      JSON.stringify(
        {
          timestamp,
          collections,
          createdAt: new Date().toISOString(),
        },
        null,
        2
      )
    );

    console.log(`Backup completed successfully: ${backupDir}`);
    return backupDir;
  } catch (error) {
    console.error("Error creating backup:", error);
    throw error;
  }
};

/**
 * Restore data from a backup
 * @param {string} backupDir - Path to backup directory
 * @param {boolean} clearBeforeRestore - Whether to clear collections before restoring
 * @returns {Promise<void>}
 */
export const restoreFromBackup = async (
  backupDir,
  clearBeforeRestore = false
) => {
  // Initialize Firebase Admin if not already initialized
  if (!db && !initializeFirebaseAdmin()) {
    throw new Error("Failed to initialize Firebase Admin");
  }

  try {
    console.log(`Restoring from backup: ${backupDir}`);

    // Check if backup directory exists
    if (!fs.existsSync(backupDir)) {
      throw new Error(`Backup directory not found: ${backupDir}`);
    }

    // Read backup info
    const infoPath = path.join(backupDir, "backup-info.json");
    if (!fs.existsSync(infoPath)) {
      throw new Error("Backup info file not found");
    }

    const backupInfo = JSON.parse(fs.readFileSync(infoPath, "utf8"));
    const { collections } = backupInfo;

    // Process each collection
    for (const collectionName of collections) {
      const filePath = path.join(backupDir, `${collectionName}.json`);

      if (!fs.existsSync(filePath)) {
        console.warn(`Backup file not found for collection: ${collectionName}`);
        continue;
      }

      // Read documents from backup file
      const documents = JSON.parse(fs.readFileSync(filePath, "utf8"));
      console.log(
        `Restoring ${documents.length} documents to ${collectionName}`
      );

      // Clear collection if requested
      if (clearBeforeRestore) {
        const batchSize = 500;
        const collectionRef = db.collection(collectionName);

        const deleteQueryBatch = async (query, resolve, reject) => {
          const snapshot = await query.get();

          if (snapshot.size === 0) {
            return resolve();
          }

          // Delete documents in a batch
          const batch = db.batch();
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });

          await batch.commit();

          // Recurse on the next batch
          process.nextTick(() => {
            deleteQueryBatch(query, resolve, reject);
          });
        };

        try {
          await new Promise((resolve, reject) => {
            deleteQueryBatch(collectionRef.limit(batchSize), resolve, reject);
          });
          console.log(`Cleared collection: ${collectionName}`);
        } catch (error) {
          console.error(`Error clearing collection ${collectionName}:`, error);
          throw error;
        }
      }

      // Restore documents in batches
      const batchSize = 500;
      let batch = db.batch();
      let operationCount = 0;

      for (const doc of documents) {
        const { id, ...data } = doc;
        const docRef = db.collection(collectionName).doc(id);
        batch.set(docRef, data);
        operationCount++;

        if (operationCount >= batchSize) {
          await batch.commit();
          batch = db.batch();
          operationCount = 0;
        }
      }

      // Commit any remaining writes
      if (operationCount > 0) {
        await batch.commit();
      }

      console.log(`Restored collection: ${collectionName}`);
    }

    console.log("Restore completed successfully");
  } catch (error) {
    console.error("Error restoring from backup:", error);
    throw error;
  }
};

/**
 * Get list of available backups
 * @returns {Array<Object>} List of backup info
 */
export const getAvailableBackups = () => {
  try {
    if (!fs.existsSync(BACKUP_PATH)) {
      return [];
    }

    const backups = [];
    const dirs = fs
      .readdirSync(BACKUP_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const dir of dirs) {
      const infoPath = path.join(BACKUP_PATH, dir, "backup-info.json");
      if (fs.existsSync(infoPath)) {
        const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
        backups.push({
          path: path.join(BACKUP_PATH, dir),
          ...info,
        });
      }
    }

    // Sort by timestamp (newest first)
    return backups.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error("Error getting available backups:", error);
    return [];
  }
};

// Command line execution
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case "backup":
      createBackup()
        .then((backupDir) => console.log(`Backup saved to: ${backupDir}`))
        .catch((error) => console.error("Backup failed:", error));
      break;

    case "restore":
      const backupDir = process.argv[3];
      if (!backupDir) {
        console.error("Backup directory required for restore");
        process.exit(1);
      }

      const clearBeforeRestore = process.argv[4] === "--clear";

      restoreFromBackup(backupDir, clearBeforeRestore)
        .then(() => console.log("Restore completed"))
        .catch((error) => console.error("Restore failed:", error));
      break;

    case "list":
      const backups = getAvailableBackups();
      console.log("Available backups:");
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.path} (${backup.createdAt})`);
        console.log(`   Collections: ${backup.collections.join(", ")}`);
      });
      break;

    default:
      console.log("Firebase Backup Utility");
      console.log("Usage:");
      console.log(
        "  node firebaseBackup.js backup              # Create a new backup"
      );
      console.log(
        "  node firebaseBackup.js restore [path]      # Restore from backup"
      );
      console.log(
        "  node firebaseBackup.js restore [path] --clear  # Clear collections before restore"
      );
      console.log(
        "  node firebaseBackup.js list                # List available backups"
      );
  }
}

export default {
  createBackup,
  restoreFromBackup,
  getAvailableBackups,
};
