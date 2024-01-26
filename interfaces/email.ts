export default interface EmailBody {
  to: string
  subject: string
  cc?: string[]
  bcc?: string[]
  message: string
}