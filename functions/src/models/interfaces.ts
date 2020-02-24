import {FlagStatus, PostTypes} from './enumerations';

export interface UserRoles {
    admin: boolean;
    basic: boolean;
    editor: boolean;
}

export interface UserMeta {
    posts?: number;
    ups?: number;
    downs?: number;
    hearts?: number;
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
    meta?: UserMeta;
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
    hearts?: number;
    ups?: number;
    downs?: number;
}

export interface Post {
    id?: string;
    authorId: string;
    createdAt: any;
    description: string;
    media?: PostMedia;
    meta: PostMeta;
    title: string;
    tags?: string[];
    type: PostTypes;
}

export interface Favorite {
    id?: string;
    authorId: string;
    title: string;
    description: string;
    pid: string;
    uid: string;
}

export interface ActionState {
    favorite: boolean;
    shared: boolean;
    up: boolean;
    down: boolean;
}

export interface Vote {
    up: boolean;
    down: boolean;
    uid?: string;
    authorId?: string;
}

export interface FlagReport {
    nudity?: boolean;
    violence?: boolean;
    harassment?: boolean;
    suicideOrSelfInjury?: boolean;
    fakeNews?: boolean;
    spam?: boolean;
    intellectualProperty?: boolean;
    unauthorizedSales?: boolean;
    hateSpeech?: boolean;
    terrorism?: boolean;
    propaganda?: boolean;
    other?: boolean;
    comment: string;
    authorId?: string;
    postId?: string;
    isComment?: boolean;
    parentId?: string;
    reporterId?: string;
    status?: FlagStatus;
    resolution?: string;
    solverId?: string;
}
