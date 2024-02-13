<script setup lang="ts">
import type {Message} from "~/@types/message";

const props = defineProps<{ message: Message }>()

const author = props.message?.author?.email ? props.message?.author?.email : 'Deleted user'

</script>

<template>
  <div class="rounded shadow border py-2 px-4">
    <div class="flex justify-between items-center mb-3">
      <div class="text-sm">Author: <span class="font-bold ">{{ author }}</span></div>
      <div v-if="message.answer">
      </div>
      <div v-else>
        <UButton variant="link" :padded="false" @click="$emit('clickAnswer',message)">Answer</UButton>
      </div>
    </div>
    <div class="mb-2" v-text="message.text"></div>
    <div v-if="message.answer" class="flex gap-1 flex-col text-green-600 align-baseline">
      <div class="font-bold text-sm">
        Answer
      </div>
      <div v-text="message.answer"></div>
      <div class="text-right">
        <UButton
            size="xs"
            variant="link"
            :padded="false"
            color="black"
            @click="$emit('clickEditAnswer',message)">Edit answer
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>