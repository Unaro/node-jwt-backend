import mailsender from "nodemailer"

class MailSender {
    constructor() {
        this.transporter = mailsender.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async senAvtivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: process.env.API_URL,
            text: '',
            html:
            `
                <div>
                    <h1>текст сообщения!</h1>
                    ${link}
                </div>
            `
        })
    }
    

}

export default new MailSender()