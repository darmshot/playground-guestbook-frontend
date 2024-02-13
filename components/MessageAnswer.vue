<script setup lang="ts">
import type {User} from "~/@types/user";
import type {AnswerForm, Message} from "~/@types/message";

const model = defineModel()
const props = defineProps<{ message: Message | null }>()

const emit = defineEmits(['answer'])

const config = useRuntimeConfig()
const base = process.server ? config.apiBase : config.public.apiBase

const user = ref<User | null>(null)

const answerForm = reactive<AnswerForm>({answer: props.message?.answer ?? ''})

async function onSubmitAnswer() {
  console.log('Submitted form:', answerForm)

  if (!props.message?.id) {
    throw new Error('Message id not found.')
  }

  emit('answer', props.message.id, answerForm.answer)

  answerForm.answer = ''
  model.value = false
}


</script>

<template>
  <UModal v-model="model">
    <div class="p-4">
      <UCard @submit.prevent="onSubmitAnswer">
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Answer
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add answer to message.
          </p>
        </template>

        <UFormGroup label="Answer" name="answer" class="mb-3">
          <UTextarea v-model="answerForm.answer"/>
        </UFormGroup>

        <template #footer>
          <UButton type="submit" color="black">
            Submit
          </UButton>
        </template>
      </UCard>
    </div>
  </UModal>
</template>

<style scoped>

</style>