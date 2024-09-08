import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL_TK,
        pass: process.env.PASS_TK,
      },
    });
  }

  public async sendNotificationOneSelf( subject: string | undefined, text: string | undefined) {
    const mailOptions = {
      from: process.env.EMAIL_TK,
      to: process.env.EMAIL_NOTIF,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error sending email');
    }
  }
}

export default EmailService;