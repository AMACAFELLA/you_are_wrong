import * as z from 'zod'

const ForgotValidation = z.object({

    email: z.string().email('Invalid email format'),

})

export { ForgotValidation }