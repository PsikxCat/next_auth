import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  // pendiente ruta produccion
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}&email=${email}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Confirma tu correo',
    html: `<p>Click <a href="${confirmLink}">aqui</a> para confirmar tu correo</p>`
  })
}