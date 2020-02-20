import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import EventContext = functions.EventContext;
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

const db = admin.firestore();

export const onPostCreated = functions.firestore.document('posts/{pid}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const data: any = {...snapshot.data()} ?? {};
            if (data.hasOwnProperty('authorId')) {
                await db.collection('users').doc(data.authorId).set({
                    meta: {
                        posts: admin.firestore.FieldValue.increment(1)
                    }
                }, {merge: true});
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onPostDeleted = functions.firestore.document('posts/{pid}')
    .onDelete(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const data: any = {...snapshot.data()};
            // update author's meta-counters
            if (data.authorId) {
                const userRef = db.doc(`users/${data.authorId}`);
                await userRef.set({
                    meta: {
                        posts: admin.firestore.FieldValue.increment(-1)
                    }
                }, {merge: true});
            }
        } catch (e) {
            console.error(e);
        }
    });
