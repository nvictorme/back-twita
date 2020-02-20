import {UserData, UserMeta, UserRoles, Vote} from "./models/interfaces";
import * as admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;
import {config} from "firebase-functions";

const db = admin.firestore();

export const initRoles = (): UserRoles => {
    return {
        admin: false,
        basic: true,
        editor: false
    };
};

export const initUserMeta = (): UserMeta => {
    return {
        posts: 0,
        ups: 0,
        downs: 0,
        hearts: 0
    }
};

export const initUserData = (user: UserRecord): UserData => {
    const {uid, displayName, photoURL, email, phoneNumber} = user;
    return {
        bio: '',
        catchPhrase: '',
        country: '',
        displayName: displayName ?? '',
        email: email ?? '',
        firstName: '',
        lastName: '',
        meta: initUserMeta(),
        phoneNumber: phoneNumber ?? '',
        photoURL: photoURL ?? config().scenario.avatar,
        uid
    } as UserData;
};

export const processVote = async (docRef: string, vote: Vote) => {
    try {
        if (vote.up) {
            await db.doc(docRef).set({
                meta: {
                    ups: admin.firestore.FieldValue.increment(1)
                }
            }, {merge: true});
        } else if (vote.down) {
            await db.doc(docRef).set({
                meta: {
                    downs: admin.firestore.FieldValue.increment(1)
                }
            }, {merge: true});
        }
    } catch (e) {
        console.error(e);
    }
};

export const removeVote = async (docRef: string, keyToRemove: string) => {
    try {
        await db.doc(docRef).set({
            meta: {
                [keyToRemove]: admin.firestore.FieldValue.increment(-1)
            }
        }, {merge: true});
    } catch (e) {
        console.error(e);
    }
};
