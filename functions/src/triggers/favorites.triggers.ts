import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import EventContext = functions.EventContext;
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

const db = admin.firestore();

export const onFavoriteCreated = functions.firestore.document('users/{uid}/favorites/{fid}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const {pid, authorId, uid} = snapshot.data() ?? {};
            if (authorId === uid) return; // if author === owner, then don't do anything
            if (authorId) {
                await db.collection('users').doc(authorId).set({
                    meta: {
                        hearts: admin.firestore.FieldValue.increment(1)
                    }
                }, {merge: true});
            }
            if (pid) {
                await db.collection('posts').doc(pid).set({
                    meta: {
                        hearts: admin.firestore.FieldValue.increment(1)
                    }
                }, {merge: true});
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onFavoriteDeleted = functions.firestore.document('users/{uid}/favorites/{fid}')
    .onDelete(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const {pid, authorId, uid} = snapshot.data() ?? {};
            if (authorId === uid) return; // if author === owner, then don't do anything
            if (pid) {
                const postRef = db.doc(`posts/${pid}`);
                const postDoc = await postRef.get();
                if (postDoc.exists) {
                    await db.collection('posts').doc(pid).set({
                        meta: {
                            hearts: admin.firestore.FieldValue.increment(-1)
                        }
                    }, {merge: true});
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
