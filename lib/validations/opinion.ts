import * as z from 'zod'

const OpinionValidation = z.object({
    opinion: z.string().min(4, 'Minimum 4 characters').max(6000, 'Maximum 6000 characters'),

})

const DisagreementValidation = z.object({
    disagreement: z.string().min(1, 'Minimum 1 characters').max(3000, 'Maximum 3000 characters'),
})

export { OpinionValidation, DisagreementValidation }