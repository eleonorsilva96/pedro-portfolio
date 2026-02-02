"use server";

import * as z from "zod";
import { Resend } from "resend";

// create resend constructor to connect with my dev env
const resend = new Resend(process.env.RESEND_API_KEY);

const ContactFormSchema = z.object({
  firstName: z.string().min(1, { message: "Por favor, insira o seu nome." }),
  email: z
  .string().min(1, { message: "O email é obrigatório." })
  .email({ message: "Por favor, insira um email válido." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

export type State = {
  errors?: {
    firstName?: string[];
    email?: string[];
    message?: string[];
  };
  message?: string | null;
  success?: boolean;
  inputs?: {
    firstName?: string | null;
    email?: string | null;
    message?: string | null;
  };
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
      message: "Existe campos por preencher.",
      success: false,
      inputs: {
        firstName: formData.get("name")?.toString(),
        email: formData.get("email")?.toString(),
        message: formData.get("message")?.toString(),
      }
    };
  }

  // destructure the data to send the email
  const { firstName, email, message } = validateFields.data;

  try {
    await resend.emails.send({
      from: `${firstName} via Pedro A. Martins Website <noreply@pedroamartins.pt>`,
      to: "pedroandre_martins@hotmail.com",
      replyTo: email,
      subject: `Pedido de Orçamento: ${firstName}`,
      html: `
                <p style="font-size: 16px;"><strong>Nome:</strong> ${firstName}</p>
                <p style="font-size: 16px;">${message}</p>
            `,
    });

    return { success: true, message: "Email enviado com sucesso!" };
  } catch {
    return { success: false, message: "Erro ao enviar o email." };
  }
};
