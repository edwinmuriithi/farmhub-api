import { Client } from 'africastalking-ts'
import db from './prisma'
import { encodeSession } from './jwt';



export const sendSMS = async (phone: string, message: string) => {
    try {
        const client = new Client({
            apiKey: process.env['ATK_API_KEY'] || '', // you can get this from the dashboard: https://account.africastalking.com
            username: process.env['ATK_USERNAME'] || 'sandbox',
        });
        const response = await client.sendSms({
            to: [phone],
            message: message,
            from: process.env['ATK_SENDER'] || undefined
        })
        console.log(response);
        return { status: "success", message: response }
    } catch (error) {
        console.log(error)
        return { status: "error", error }
    }
}


export const generateAndSendResetCode = async (phone: string, urlPrefix: string) => {
    try {
        let code = (Math.floor((Math.random() * 99999) + 10000)).toString();
        let user = await db.user.findFirst({
            where: {
                phone: parsePhoneNumber(phone) || ''
            }
        })
        if (!user) {
            console.log(`ERROR: Password reset - User with phoneNumber ${phone} not found`)
            return null
        }

        let session = encodeSession(process.env['SECRET_KEY'] as string, {
            createdAt: ((new Date().getTime() * 10000) + 621355968000000000),
            userId: user?.id as string,
            role: "RESET_TOKEN"
        });

        user = await db.user.update({
            where: {
                ...(phone) && { phone: parsePhoneNumber(phone) || '' }
            },
            data: {
                resetToken: session.token,
                resetTokenExpiresAt: new Date(session.expires)
            }
        });

        let smsAuth = await db.smsAuth.create({
            data: {
                code,
                token: session.token,
                user: { connect: { phone } },
                expiry: new Date(new Date().setMinutes(new Date().getMinutes() + 5))
            }
        });

        let resetUrl = `${urlPrefix + code}`
        console.log(resetUrl)
        let otpMessage = `Hello ${(user.names).split(" ")[0]},\nWelcome to FarmHub\n\nUse the link below to reset your password.\n${resetUrl}`
        // let smsResponse = await sendSMS(parsePhoneNumber(phone) || '', otpMessage);
        return code
    } catch (error) {
        console.log(error);
        return null
    }
}


export const parsePhoneNumber = (phone: string) => {
    if (phone.length < 9) {
        return null
    }
    if (phone.length === 9) {
        return "+254" + phone
    }
    if (phone.length === 10 && phone[0] === "0") {
        return "+254" + phone.slice(1)
    }
    if (phone.length === 12) {
        return "+" + phone.slice(1, phone.length - 1)
    }
    if (phone.length === 13 && phone[0] === "+") {
        return phone
    }
    return null
}