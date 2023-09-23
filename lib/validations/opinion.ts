import * as z from 'zod'

const OpinionValidation = z.object({
    opinion: z.string().min(40, 'Minimum 40 characters').max(500, 'Maximum 500 characters, we do not want paragraphs here.'),

})

const DisagreementValidation = z.object({
    disagreement: z.string().min(40, 'Minimum 40 characters, you can not just say you are wrong.').max(500, 'Maximum 500 characters, we do not want paragraphs here.'),
})

export { OpinionValidation, DisagreementValidation }