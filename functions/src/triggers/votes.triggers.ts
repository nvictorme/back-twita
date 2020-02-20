import * as functions from 'firebase-functions';
import EventContext = functions.EventContext;
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {processVote, removeVote} from "../helpers";
import Change = functions.Change;

export const onPostVoteCreated = functions.firestore.document('posts/{pid}/votes/{vid}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const pid: string | undefined = snapshot.ref.parent.parent?.id;
            const vote: any = {...snapshot.data()};
            // Users can't vote for themselves
            if (vote.uid === vote.authorId) return;
            if (pid) {
                await processVote(`posts/${pid}`, vote);
                await processVote(`users/${vote.authorId}`, vote);
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onCommentVoteCreated = functions.firestore.document('posts/{pid}/comments/{cid}/votes/{vid}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {
        try {
            const commentPath: string | undefined = snapshot.ref.parent.parent?.path;
            const vote: any = {...snapshot.data()};
            // Users can't vote for themselves
            if (vote.uid === vote.authorId) return;
            if (commentPath) {
                await processVote(commentPath, vote);
                await processVote(`users/${vote.authorId}`, vote);
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onPostVoteUpdated = functions.firestore.document('posts/{pid}/votes/{vid}')
    .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
        try {
            const votePath: string | undefined = change.after.ref.parent.parent?.path;
            if (votePath) {
                await updateVoteOnPath(votePath, change);
            }
        } catch (e) {
            console.error(e);
        }
    });

export const onCommentVoteUpdated = functions.firestore.document('posts/{pid}/comments/{cid}/votes/{vid}')
    .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {
        try {
            const votePath: string | undefined = change.after.ref.parent.parent?.path;
            if (votePath) {
                await updateVoteOnPath(votePath, change);
            }
        } catch (e) {
            console.error(e);
        }
    });

const updateVoteOnPath = async (votePath: string, change: Change<DocumentSnapshot>) => {
    const voteBefore: any = {...change.before.data()};
    const voteAfter: any = {...change.after.data()};
    const authorId: string = voteAfter.authorId;
    // Users can't vote for themselves
    if (voteAfter.uid === authorId) return;
    // if both are false it means the user removed any votes
    if (!voteAfter.up && !voteAfter.down) {
        // update the one that was removed
        if (voteBefore.up) {
            await removeVote(votePath, 'ups');
            await removeVote(`users/${authorId}`, 'ups');
        } else if (voteBefore.down) {
            await removeVote(votePath, 'downs');
            await removeVote(`users/${authorId}`, 'downs');
        }
    } else {
        if (voteBefore.down && voteAfter.up) {
            // if changed from down to up, remove one down
            await removeVote(votePath, 'downs');
            await removeVote(`users/${authorId}`, 'downs');
        } else if (voteBefore.up && voteAfter.down) {
            // if changed from up to down, remove one up
            await removeVote(votePath, 'ups');
            await removeVote(`users/${authorId}`, 'ups');
        }
        // always process the vote
        await processVote(votePath, voteAfter);
        await processVote(`users/${authorId}`, voteAfter);
    }
};
