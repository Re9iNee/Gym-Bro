type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
};
async function sendEmail({ to, subject, text }: SendEmailParams) {
  return await {
    id: "71cdfe68-cf79-473a-a9d7-21f91db6a526",
  };
}

export const emailService = {
  sendEmail,
};
