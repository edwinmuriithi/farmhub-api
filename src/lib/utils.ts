import prisma from "./prisma"
import { decodeSession } from "./jwt";




export let apiHost = import.meta.env.FHIR_BASE_URL












export const getUserFromToken = async (token: string) => {
    let decodedSession = decodeSession(import.meta.env['SECRET_KEY'] as string, token.split(' ')[1])
    if (decodedSession.type == 'valid') {
        // let currentRole = decodedSession.session.role;
        let userId = decodedSession.session.userId;
        return userId
    }
    return null
}

export const getRoleFromToken = async (token: string) => {
    let decodedSession = decodeSession(import.meta.env['SECRET_KEY'] as string, token.split(' ')[1])
    if (decodedSession.type == 'valid') {
        let currentRole = decodedSession.session.role;
        // let userId = decodedSession.session.userId;
        return currentRole
    }
    return null
}