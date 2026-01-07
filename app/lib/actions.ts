"use server";

import * as z from "zod";
import { Resend } from "resend";

// create resend constructor to connect with my dev env
const resend = new Resend(process.env.RESEND_API_KEY);

const ContactFormSchema = z.object({
  firstName: z.string().min(1, { message: "Please insert your first name" }),
  email: z.email("Please enter a valid email address"),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }),
});

export type State = {
  errors?: {
    firstName?: string[];
    email?: string[];
    message?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function sendEmail(preState: State, formData: FormData) {
  const validateFields = ContactFormSchema.safeParse({
    firstName: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  // if a validation error happens return the field property error object
  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "There are missing fields.",
      success: false
    };
  }

  // destructure the data to send the email
  const { firstName, email, message } = validateFields.data;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // change to email in prod env
      to: "eleonor.uxui@gmail.com", // change to client email
      subject: `Quote Request: ${firstName}`,
      html: `
                <p style="font-size: 16px;"><strong>Name:</strong> ${firstName}</p>
                <p style="font-size: 16px;">${message}</p>
            `,
    });

    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to send email." };
  }
};
