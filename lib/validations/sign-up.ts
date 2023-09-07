import * as z from 'zod'

import { checkUsernameExists, checkEmailExists } from '../actions/user.actions'

let abortControllersMap:
    {
        username: AbortController[],
        email: AbortController[]
    } = {
    username: [],
    email: [],
}

const checkUsername = async (value: string) => {
    while (abortControllersMap.username.length > 0) {
        abortControllersMap.username.pop()?.abort()
    }
    const abortController = new AbortController()
    abortControllersMap.username.push(abortController)
    const result = await fetch(
        `/api/user/check-exists?username=${value}`,
        {
            cache: "no-cache",
            signal: abortController.signal
        }
    ).then((res) => res.json()).then((res) => res.result);
    return result
}
const checkEmail = async (value: string) => {

    while (abortControllersMap.email.length > 0) {
        abortControllersMap.email.pop()?.abort()
    }
    const abortController = new AbortController()
    abortControllersMap.email.push(abortController)
    const result = await fetch(
        `/api/user/check-exists?email=${value}`,
        {
            cache: "no-cache",
            signal: abortController.signal
        }
    ).then((res) => res.json()).then((res) => res.result);
    return result
}

const SignUpValidation = z.object({

    username: z.string()
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "The username must contain only letters[a-z,A-Z], numbers[0-9] and underscore (_)"
        ).min(4, 'Minimum 4 characters')
        .max(30, 'Maximum 30 characters').refine(checkUsername, "Username already exists"),
    email: z.string().email('Invalid email format').refine(checkEmail, "Email address already exists"),
    password: z.string().min(6, 'Minimum 6 characters'),

})

export { SignUpValidation }