<script setup lang="ts">
import {useLogoutFetch, useUserFetch} from "~/composables/fetches";
import {useUserState} from "~/composables/states";

const userState = useUserState()
const loginRegisterModalIsOpenState = useLoginRegisterModalIsOpenState()

const {data,error} = await useAsyncData(() => useUserFetch())

if (data.value) {
  userState.value = data.value
}

if (error.value){
  console.log(error.value)
}

const handleLogout = () => useLogoutFetch().then(() => userState.value = null)

const handleLoginRegister = () => loginRegisterModalIsOpenState.value = true

</script>

<template>
  <div class="border-b pb-1">
    <div class="container mx-auto px-2 py-2">
      <div class="w-4/6 grid-cols-3 grid items-center mx-auto">
        <div class="flex-grow">
        </div>
        <div class="text-center">
          <Logo class="inline-block"/>
        </div>
        <div class="flex-grow text-right">
          <template v-if="userState?.email">
           <span class="mr-3">{{userState?.email}}</span>
            <UButton @click="handleLogout">Logout</UButton>
          </template>
          <template v-else>
            <UButton @click="handleLoginRegister">Login / Register</UButton>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>