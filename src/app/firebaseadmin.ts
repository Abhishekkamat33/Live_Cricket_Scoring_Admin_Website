import admin from 'firebase-admin';

// Use a global variable to ensure admin is only initialized once in development
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Use private key with proper line breaks replaced:
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    // Optionally specify databaseURL if you use Realtime Database
    // databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;
