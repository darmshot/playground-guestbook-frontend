<script setup lang="ts">




</script>

<template>
  <nav>
    <ul class="flex gap-2">
      <li>
        <NuxtLink :to="item.href">{{ item.name }}</NuxtLink>
      </li>
      <li v-for="(item,key) in data.data" :key="key">
        <NuxtLink :to="item.href">{{ item.name }}</NuxtLink>
      </li>
    </ul>
  </nav>

</template>

<style scoped>

</style>