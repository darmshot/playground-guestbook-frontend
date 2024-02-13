<script setup lang="ts">
import type {Message, MessageForm, MessagePaginate} from "~/@types/message";
import {useLoginRegisterModalIsOpenState, useUserState} from "~/composables/states";
import type {AsyncData} from "#app";
import {FetchError} from "ofetch";

const userState = useUserState()
const loginRegisterModalIsOpen = useLoginRegisterModalIsOpenState()

const page = ref(1)
const isOpenMessageAnswer = ref(false)
const messageAnswer = ref<Message | null>(null)

const config = useRuntimeConfig()
const base = process.server ? config.apiBase : config.public.apiBase

const messageForm = reactive<MessageForm>({text: ''})

const {
  data,
  pending,
  error,
  execute,
  status
} = await useAsyncData(() => $fetch(`${base}/api/messages`, {
  params: {page: page.value}
})) as AsyncData<MessagePaginate, FetchError>

if (error.value) {
  showError({...error.value})
}
const onSubmitMessage = async () => {
  console.log('Submitted form:', messageForm)

  await useStoreMessageFetch(messageForm)
}

const onAnswer = async (id: Number, answer: string) => {
  console.log('Answered: ', {id, answer})

  const dataAnswer = await useUpdateMessageAnswerFetch(id, {answer: answer})

  const index = data.value.data.findIndex(item => item.id === dataAnswer.data.id)

  if (index === -1) {
    return
  }

  data.value.data[index].answer = dataAnswer.data.answer
}

const handleChangePagination = () => {
  for (const message of data.value.data) {
    Echo.leave(`messages.${message.id}`);
  }

  execute()
}

const handleAnswer = (message: Message) => {
  console.log('Handle message:', message)
  messageAnswer.value = message

  isOpenMessageAnswer.value = true
}

onMounted(() => {
  if (!data) {
    return
  }


  Echo.channel(`messages`)
      .listen('MessageCreated', (e: { message: Message }) => {
        if (page.value !== 1) {
          return
        }

        console.log('Fire MessageCreated:', e.message);

        data.value.data.unshift(e.message)
        data.value.data.splice(-1)

        Echo.private(`messages.${e.message.id}`)
            .listen('MessageAnswered', (e: { message: Message }) => {
              console.log('Fire MessageAnswered:', e.message)

              const index = data.value.data.findIndex((item) => item.id === e.message.id)

              if (index === -1) {
                return
              }

              data.value.data[index].answer = e.message.answer
            })
      })

  for (const message of data.value.data) {
    Echo.private(`messages.${message.id}`)
        .listen('MessageAnswered', (e: { message: Message }) => {
          console.log('Fire MessageAnswered:', e.message)

          const index = data.value.data.findIndex((item) => item.id === e.message.id)

          if (index === -1) {
            return
          }

          data.value.data[index].answer = e.message.answer
        })
  }
})

onBeforeUnmount(() => {
  Echo.leaveChannel(`messages`);

  for (const message of data.value.data) {
    Echo.leave(`messages.${message.id}`);
  }
})

watch(status, (value) => {
  if (value !== 'success') {
    return
  }

  if (process.server) {
    return
  }

  for (const message of data.value.data) {
    Echo.private(`messages.${message.id}`)
        .listen('MessageAnswered', (e: { message: Message }) => {
          console.log('Fire MessageAnswered:', e.message)

          const index = data.value.data.findIndex((item) => item.id === e.message.id)

          if (index === -1) {
            return
          }

          data.value.data[index].answer = e.message.answer
        })
  }
})

</script>

<template>
  <div>
    <template v-if="pending">
      Loading...
    </template>
    <template v-else-if="error">
      Error
    </template>
    <template v-else>
      <template v-if="data.data.length">
        <ul>
          <MessageItem v-for="message in data.data"
                       :key="message.id"
                       :message="message"
                       class="mb-3"
                       @click-answer="handleAnswer"
                       @click-edit-answer="handleAnswer"
          />
        </ul>

        <UPagination class="mb-8"
                     v-model="page"
                     @update:model-value="handleChangePagination"
                     v-show="['idle','success'].includes(status) && data.meta.last_page > 1"
                     :page-count="data.meta.per_page"
                     :total="data.meta.total"/>
      </template>
      <template v-else>
        <div class="bg-blue-50 rounded text-gray-600 py-8 shadow mb-4 text-center">
          Not Messages yet. <br>
        </div>
      </template>
    </template>
    <hr class="my-5">

    <template v-if="userState?.email">
      <form @submit.prevent="onSubmitMessage">
        <div>
          {{ userState?.email }}
        </div>
        <UFormGroup label="Message" name="text" class="mb-3">
          <UTextarea placeholder="Message" v-model="messageForm.text"/>
        </UFormGroup>
        <UButton type="submit" color="black">
          Submit
        </UButton>
      </form>
    </template>
    <template v-else>
      <div class="text-center rounded text-gray-600 py-8 shadow mb-4">
        <div class="mb-3">
          For added message need
        </div>
        <UButton @click="loginRegisterModalIsOpen = !loginRegisterModalIsOpen">Login / Register</UButton>
      </div>
    </template>

    <LazyMessageAnswer v-if="isOpenMessageAnswer"
                       v-model="isOpenMessageAnswer"
                       @answer="onAnswer"
                       :message="messageAnswer"
    />
  </div>
</template>

<style scoped>

</style>