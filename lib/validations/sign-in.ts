import * as z from 'zod'

const SignInValidation = z.object({

    username: z.string()
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "The username must contain only letters[a-z,A-Z], numbers[0-9] and underscore (_)"
        ).min(4, 'Minimum 4 characters')
        .max(30, 'Maximum 30 characters'),
    password: z.string().min(6, 'Minimum 6 characters'),

})

export { SignInValidation }