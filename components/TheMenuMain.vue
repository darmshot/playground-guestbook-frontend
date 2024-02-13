<script setup lang="ts">






</script>

<template>
<nav>
  <ul class="flex gap-4">
    <li class="uppercase font-medium" v-for="(item,key) in []" :key="key">
      <NuxtLink :to="item.href">{{ item.name }}</NuxtLink>
    </li>
  </ul>
</nav>
</template>

<style scoped>

</style>