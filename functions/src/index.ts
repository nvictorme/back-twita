import * as admin from 'firebase-admin';

admin.initializeApp();

// TRIGGERS
export * from './triggers/auth.triggers';
export * from './triggers/post.triggers';
