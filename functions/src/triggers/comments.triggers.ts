import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import EventContext = functions.EventContext;
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {Post, UserData} from "../models/interfaces";

const db = admin.firestore();
const messaging = admin.messaging();

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
                const parentPostDoc = await db.collection('posts').doc(postId).get();
                const {authorId, title} = {...parentPostDoc.data()} as Post;
                const authorSnap = await db.collection('users').doc(authorId).get();
                const {fcmTokens} = {...authorSnap.data()} as UserData;
                if (fcmTokens) {
                    if (fcmTokens.length) {
                        await messaging.sendToDevice(fcmTokens, {
                            data: {
                                'type': 'new_comment_on_post',
                                'post_id': postId
                            },
                            notification: {
                                title: 'New Comment',
                                body: `There's a new comment on your post '${title}'`
                            }
                        });
                    }
                }
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
