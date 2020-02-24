import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {CallableContext} from "firebase-functions/lib/providers/https";
import {FlagReport} from "../models/interfaces";

const db = admin.firestore();

export const deletePost = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (!context.auth?.uid) {
            return {
                success: false,
                error: true,
                message: 'Unauthorized'
            }
        }
        const {postPath, authorId} = data;
        if (authorId === context.auth?.uid) {
            await db.doc(postPath).delete();
            return {
                success: true,
                error: false,
                message: 'Deleted successfully'
            }
        } else {
            return {
                success: false,
                error: true,
                message: 'You are not the author'
            }
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: true,
            message: e.message
        }
    }
});

export const flagPost = functions.https.onCall(async (data: any, context: CallableContext) => {
    try {
        if (!context.auth?.uid) {
            return {
                success: false,
                error: true,
                message: 'Unauthorized'
            }
        }
        const flagReport = data as FlagReport;
        flagReport.reporterId = context.auth.uid;
        await db.collection('flag_reports').add(flagReport);
        return {
            success: true,
            error: false,
            message: 'Flag report received successfully'
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: true,
            message: e.message
        }
    }
});
