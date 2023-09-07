import * as z from 'zod'

const VerifyValidation = z.object({


    "1": z.number().min(1).max(1),
    "2": z.number().min(1).max(1),
    "3": z.number().min(1).max(1),
    "4": z.number().min(1).max(1),
    "5": z.number().min(1).max(1),
    "6": z.number().min(1).max(1),
})

export { VerifyValidation }