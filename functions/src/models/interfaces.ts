import * as admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;
import {PostTypes} from './enumerations';

export interface UserRoles {
    admin: boolean;
    basic: boolean;
    editor: boolean;
}

export interface UserData {
    bio?: string;
    catchPhrase?: string;
    country?: string;
    displayName: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    photoURL?: string;
    uid?: string;
}

export interface Media {
    fileName?: string;
    url?: string;
    code?: string;
}

export interface PostMeta {
    comments?: number;
    shares?: number;
    stars?: number;
}

export interface Post {
    authorId: string;
    createdAt: Timestamp;
    description: string;
    media?: Media;
    meta: PostMeta;
    title: string;
    tags?: string[];
    type: PostTypes;
}

