export class EmailService {
  async sendVerificationEmail(email: string, token: string) {
    console.log(`[Email Mock] Sending verification email to ${email} with token ${token}`);
    // In production, use nodemailer or a service like SendGrid/Postmark
  }

  async sendPasswordResetEmail(email: string, token: string) {
    console.log(`[Email Mock] Sending password reset email to ${email} with token ${token}`);
  }

  async sendInvitationEmail(email: string, organizationName: string, token: string) {
    console.log(`[Email Mock] Sending invitation to join ${organizationName} to ${email} with token ${token}`);
  }
}
