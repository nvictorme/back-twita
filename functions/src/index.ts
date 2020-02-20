import * as admin from 'firebase-admin';

admin.initializeApp();

// TRIGGERS
export * from './triggers/auth.triggers';
export * from './triggers/posts.triggers';
export * from './triggers/favorites.triggers';
export * from './triggers/votes.triggers';
