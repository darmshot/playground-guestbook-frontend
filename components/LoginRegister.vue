<script setup lang="ts">
import {useLoginRegisterModalIsOpenState, useUserState} from "~/composables/states";
import type {User} from "~/@types/user";
import {useLoginFetch, useRegisterFetch, useUserFetch} from "~/composables/fetches";

const loginRegisterModalIsOpenState = useLoginRegisterModalIsOpenState()
const userState = useUserState()

const config = useRuntimeConfig()
const base = process.server ? config.apiBase : config.public.apiBase

const user = ref<User | null>(null)

const items = [{
  slot: 'login',
  label: 'Login'
}, {
  slot: 'register',
  label: 'Register'
}]

const loginForm = reactive({email: 'superadmin@example.com', password: 'password', remember: false})
const registerForm = reactive({email: '', name: '', password: '', password_confirmation: ''})

async function onSubmitLogin() {
  console.log('Submitted form:', loginForm)

  await useLoginFetch(loginForm)

  userState.value = await useUserFetch()

  loginRegisterModalIsOpenState.value = false
}

async function onSubmitRegister() {
  console.log('Submitted form:', registerForm)

  await useRegisterFetch(registerForm)

  userState.value = await useUserFetch()
  loginRegisterModalIsOpenState.value = false
}


</script>

<template>
  <UModal v-model="loginRegisterModalIsOpenState">
    <div class="p-4">
      <UTabs :items="items" class="w-full">
        <template #login="{ item }">
          <UCard @submit.prevent="onSubmitLogin">
            <template #header>
              <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Login to Account.
              </p>
            </template>

            <UFormGroup label="Email" name="email" class="mb-3">
              <UInput v-model="loginForm.email"/>
            </UFormGroup>
            <UFormGroup label="Password" name="username" class="mb-3">
              <UInput v-model="loginForm.password" type="password"/>
            </UFormGroup>
            <UCheckbox v-model="loginForm.remember" label="Remember Me"/>

            <template #footer>
              <UButton type="submit" color="black">
                Login
              </UButton>
            </template>
          </UCard>
        </template>

        <template #register="{ item }">
          <UCard @submit.prevent="onSubmitRegister">
            <template #header>
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ item.label }}
              </h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              </p>
            </template>

            <UFormGroup label="Your name" name="name" required class="mb-3">
              <UInput v-model="registerForm.name" type="text" required/>
            </UFormGroup>
            <UFormGroup label="Email" name="email" required class="mb-3">
              <UInput v-model="registerForm.email" type="email" required/>
            </UFormGroup>
            <UFormGroup label="Password" name="password" required class="mb-3">
              <UInput v-model="registerForm.password" type="password" required/>
            </UFormGroup>
            <UFormGroup label="Password confirmation" name="password_confirmation" required>
              <UInput v-model="registerForm.password_confirmation" type="password" required/>
            </UFormGroup>

            <template #footer>
              <UButton type="submit" color="black">
                Create
              </UButton>
            </template>
          </UCard>
        </template>
      </UTabs>
    </div>
  </UModal>
</template>

<style scoped>

</style>