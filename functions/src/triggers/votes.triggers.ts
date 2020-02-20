import * as functions from 'firebase-functions';
import EventContext = functions.EventContext;
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {processVote, removeVote} from "../helpers";
import Change = functions.Change;

export const onPostVoteCreated = functions.firestore.document('posts/{pid}/votes/{vid}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const postId: string | undefined = snapshot.ref.parent.parent?.id;
            const vote: any = {...snapshot.data()} ?? {};
            if (postId && vote.hasOwnProperty('up') && vote.hasOwnProperty('down')) {
                await processVote(``, vote);
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onPostVoteUpdated = functions.firestore.document('posts/{pid}/votes/{vid}')
    .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
        try {
            const postId: string | undefined = change.after.ref.parent.parent?.id;
            const voteBefore: any = {...change.before.data()};
            const voteAfter: any = {...change.after.data()};
            const authorId: string = voteAfter.authorId;
            // if both are false it means the user removed any votes
            if (!voteAfter.up && !voteAfter.down) {
                // update the one that was removed
                if (voteBefore.up) {
                    await removeVote(`posts/${postId}`, 'ups');
                    await removeVote(`users/${authorId}`, 'ups');
                } else if (voteBefore.down) {
                    await removeVote(`posts/${postId}`, 'downs');
                    await removeVote(`users/${authorId}`, 'downs');
                }
            } else {
                if (voteBefore.down && voteAfter.up) {
                    // if changed from down to up, remove one down
                    await removeVote(`posts/${postId}`, 'downs');
                    await removeVote(`users/${authorId}`, 'downs');
                } else if (voteBefore.up && voteAfter.down) {
                    // if changed from up to down, remove one up
                    await removeVote(`posts/${postId}`, 'ups');
                    await removeVote(`users/${authorId}`, 'ups');
                }
                // always process the vote
                await processVote(`posts/${postId}`, voteAfter);
                await processVote(`users/${authorId}`, voteAfter);
            }
        } catch (e) {
            console.error(e);
        }
    });
