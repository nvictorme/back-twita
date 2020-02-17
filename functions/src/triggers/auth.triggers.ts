import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import UserRecord = admin.auth.UserRecord;
import EventContext = functions.EventContext;
import {UserData} from "../models/interfaces";
import {initRoles, initUserData} from "../helpers";

const auth = admin.auth();
const db = admin.firestore();

export const initializeUser = functions.auth.user().onCreate(async (user: UserRecord, context: EventContext) => {
    try {
        const userData: UserData = initUserData(user);
        await auth.setCustomUserClaims(user.uid, {roles: initRoles()});
        await db.collection('users').doc(user.uid).set(userData);
    } catch (e) {
        console.error(e);
    }
});

