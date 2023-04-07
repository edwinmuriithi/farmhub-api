import prisma from "./prisma";
import { decodeSession } from "./jwt";
import { parsePhoneNumber } from "./sms";


export let apiHost = process.env.FHIR_BASE_URL;


export const getUserFromPhone = async (phone: string) => {
    let _phone = parsePhoneNumber(phone);
    let user = await prisma.user.findFirst({
        where: {
            phone: _phone || ''
        }
    });
    if (user) {
        return user.id;
    }
    return null;
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
    try {
        let user = await getUserFromToken(token);
        let _user = await prisma.user.findFirst({
            where: {
                id: user || ''
            }
        })
        return _user?.role || null
    } catch (error) {
        console.log(error)
        return null
    }
}



export const getPaymentStatus = async (userId: string) => {
    try {
        let payments = await prisma.payment.findMany({
            where: {
                userId: userId
            },
            take: 1,
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (payments.length < 1) {
            return false;
        }
        let days = daysDifference(new Date().toISOString(), new Date(payments[0].updatedAt).toISOString()) || 31
        if (days > 30) {
            return false;
        }
        return payments[0];
    } catch (error) {
        console.log(error);
        return false;
    }

}


export const daysDifference = (from: string, to: string) => {
    try {
        var date1 = new Date(from);
        var date2 = new Date(to);
        // To calculate the time difference of two dates
        var Difference_In_Time = date2.getTime() - date1.getTime();
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days;
    } catch (error) {
        return null
    }
}

