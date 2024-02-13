import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import {useBroadcastingAuthFetch} from "~/composables/fetches";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const pusherKey = config.public.pusherKey
    const pusherCluster = config.public.pusherCluster

    window.Pusher = Pusher


    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: [pusherKey],
        cluster: [pusherCluster],
        forceTLS: true,
        authorizer: (channel, options) => {
            return {
                authorize: async (socketId, callback) => {
                    try {
                        /*                const response = await $fetch('/broadcasting/auth', {
                                            method: "POST",
                                            body: {
                                                socket_id: socketId,
                                                channel_name: channel.name
                                            }})*/

                        const response = await useBroadcastingAuthFetch({
                            socket_id: socketId,
                            channel_name: channel.name
                        })

                        callback(null, response)
                    } catch (error) {
                        callback(error)
                    }
                }
            };
        },
    })
})