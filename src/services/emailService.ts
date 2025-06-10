import { EMAIL_CONFIG } from '../config/emailConfig';

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

interface Attachment {
  filename: string;
  content: string;
}

interface EmailWithAttachmentsParams extends EmailParams {
  attachments?: File[];
}

interface EmailWithBase64AttachmentsParams extends EmailParams {
  attachments?: Attachment[];
}

class EmailService {
  private baseUrl: string;

  constructor(baseUrl = EMAIL_CONFIG.apiBaseUrl) {
    this.baseUrl = baseUrl;
  }

  async sendEmail({ to, subject, body }: EmailParams) {
    try {
      const response = await fetch(`${this.baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async sendEmailWithAttachments({ to, subject, body, attachments = [] }: EmailWithAttachmentsParams) {
    try {
      const formData = new FormData();
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('body', body);

      attachments.forEach((file, index) => {
        formData.append(`attachment${index}`, file);
      });

      const response = await fetch(`${this.baseUrl}/api/send-email`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email with attachments:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async sendEmailWithBase64Attachments({ to, subject, body, attachments = [] }: EmailWithBase64AttachmentsParams) {
    try {
      const response = await fetch(`${this.baseUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          attachments,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/send-email`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking API health:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export default EmailService; 