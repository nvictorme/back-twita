import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import EventContext = functions.EventContext;
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";

const db = admin.firestore();

export const onPostCommentCreated = functions.firestore.document('posts/{pid}/comments/{cid}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const postId: string | undefined = snapshot.ref.parent.parent?.id;
            if (postId) {
                await db.collection('posts').doc(postId).set({
                    meta: {
                        comments: admin.firestore.FieldValue.increment(1)
                    }
                }, {merge: true});
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onPostCommentDeleted = functions.firestore.document('posts/{pid}/comments/{cid}')
    .onDelete(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const postId: string | undefined = snapshot.ref.parent.parent?.id;
            if (postId) {
                const postRef = db.doc(`posts/${postId}`);
                const postDoc = await postRef.get();
                if (postDoc.exists) {
                    await db.collection('posts').doc(postId).set({
                        meta: {
                            comments: admin.firestore.FieldValue.increment(-1)
                        }
                    }, {merge: true});
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
