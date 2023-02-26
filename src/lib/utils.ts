import prisma from "./prisma";
import { decodeSession } from "./jwt";


export let apiHost = process.env.FHIR_BASE_URL;

export let checkPaymentStatus = async (userId: string) => {
    try {
        let user = await prisma.user.findFirst({
            where: { id: userId }
        });
        if (!user) {
            return false;
        }



    } catch (error) {
        console.log(error);
        return false;
    }
}




export const getUserFromToken = async (token: string) => {
    let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token)
    if (decodedSession.type == 'valid') {
        // let currentRole = decodedSession.session.role;
        let userId = decodedSession.session.userId;
        return userId
    }
    return null
}

export const getRoleFromToken = async (token: string) => {
    let decodedSession = decodeSession(process.env['SECRET_KEY'] as string, token)
    if (decodedSession.type == 'valid') {
        let currentRole = decodedSession.session.role;
        // let userId = decodedSession.session.userId;
        return currentRole
    }
    return null
}