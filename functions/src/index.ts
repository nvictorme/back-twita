import * as admin from 'firebase-admin';

admin.initializeApp();

// CALLABLES
export * from './callables/posts.callables';

// TRIGGERS
export * from './triggers/auth.triggers';
export * from './triggers/posts.triggers';
export * from './triggers/comments.triggers';
export * from './triggers/favorites.triggers';
export * from './triggers/votes.triggers';
