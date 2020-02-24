// *********************************************
// !!! DO NOT ALTER THE ORDER OF ENUMS !!!
// IF YOU EVER NEED TO ADD NEW ENTRIES TO AN ENUM
// MAKE SURE YOU DO IT AT THE END OF IT
// OR YOU WILL END UP CAUSING IRREVERSIBLE DAMAGE
// *******************************************
export enum ImageSize {
    small = 250,
    medium = 500,
    large = 1000,
    full = 2000
}

export enum AuthProviders {
    GOOGLE,
    GITHUB,
    TWITTER,
    FACEBOOK
}

export enum PostTypes {
    Text,
    Code,
    Image,
    File,
    Video,
    Audio
}

export enum FlagStatus {
    open,
    processing,
    hold,
    solved,
    closed
}
