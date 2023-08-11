import * as z from 'zod';

export const OpinionValidation = z.object({
    opinion: z.string().nonempty().min(3, { message: 'Minimun 3 characters'}),
    accountId: z.string(),
})

export const DisagreementValidation = z.object({
    opinion: z.string().nonempty().min(10, {message: 'Minimun 10 characters'}),
    accountId: z.string(),
})