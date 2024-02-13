import type {AnswerForm, Message, MessageForm} from "~/@types/message";

import {defu} from 'defu'
import type {NitroFetchOptions} from "nitropack";
import type {User} from "~/@types/user";
import type {LoginForm, RegisterForm} from "~/@types/auth";

export const useBaseFetch = async (path: string, options?: NitroFetchOptions<`${string}/${string}`, "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace"> | undefined) => {

    const config = useRuntimeConfig()
    const base = process.server ? config.apiBase : config.public.apiBase

    let headers: any = {
        'Accept': 'application/json',
    }

    if (process.server) {
        const origin = 'https://guestbook-frontend.indigital-dev.com'
        const requestHeaders = useRequestHeaders(['cookie'])
        headers = {
            ...headers,
            ...requestHeaders,
            Referer: origin,
        }
    }

    if (['post', 'put', 'patch', 'delete'].includes(options?.method ?? '')) {
        await useCsrfFetch()
        headers['X-XSRF-TOKEN'] = useCookie<string>('XSRF-TOKEN').value
    }

    const params: any = defu(options, {
        credentials: 'include',
        headers
    })

    return await $fetch(`${base}${path}`, params)
}

export const useCsrfFetch = () => useBaseFetch('/sanctum/csrf-cookie')


export const useStoreMessageFetch = (messageForm: MessageForm) => {
    return useBaseFetch('/api/messages', {
        body: messageForm,
        method: 'post'
    })
}


export const useUserFetch = () => useBaseFetch('/api/user') as Promise<User>
export const useLogoutFetch = () => useBaseFetch('/logout', {method: 'post'})
export const useLoginFetch = (loginForm: LoginForm) => useBaseFetch('/login', {method: 'post', body: loginForm})
export const useRegisterFetch = (registerForm: RegisterForm) => useBaseFetch('/register', {
    method: 'post',
    body: registerForm
})
export const useUpdateMessageAnswerFetch = (id: Number, answerForm: AnswerForm) => useBaseFetch(`/api/message-answers/${id}`, {
    method: 'patch',
    body: answerForm
}) as Promise<{ data: Message }>


export const useBroadcastingAuthFetch = (authForm: {
    socket_id: string,
    channel_name: string
}) => useBaseFetch(`/broadcasting/auth`, {
    method: 'post',
    body: authForm
})
