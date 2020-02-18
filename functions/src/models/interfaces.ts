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

export interface PostMedia {
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
    id?: string;
    authorId: string;
    createdAt: Date;
    description: string;
    media?: PostMedia;
    meta: PostMeta;
    title: string;
    tags?: string[];
    type: PostTypes;
}

