import {UserData, UserRoles} from "./models/interfaces";
import * as admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;
import {config} from "firebase-functions";

export const initRoles = (): UserRoles => {
    return {
        admin: false,
        basic: true,
        editor: false
    };
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
        phoneNumber: phoneNumber ?? '',
        photoURL: photoURL ?? config().scenario.avatar,
        uid
    } as UserData;
};
