import * as z from 'zod'

const ResetPassValidation = z.object({
    password: z.string().min(6, 'Minimum 6 characters'),
    confirm: z.string().min(6, 'Minimum 6 characters'),
})

export { ResetPassValidation }