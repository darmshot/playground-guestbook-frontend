<script setup lang="ts">
function someErrorLogger(error: Error) {
  console.log('Error:', error)
}

const recoverFromError = async (error) => {
  await navigateTo('/');
  error.value = null;
}


</script>


<template>
  <div>
    <!--    <NuxtWelcome />-->

    <TheHeader class="mb-4"/>

    <NuxtErrorBoundary @error="someErrorLogger">
      <!-- You use the default slot to render your content -->
      <NuxtPage/>

      <template #error="{ error }">
        <div class="container mx-auto text-center space-y-3 mt-16">
          <div>
            Oh no, something broke when loading the page!
          </div>
          <div>
            <code>{{ error }}</code>
          </div>
          <div>
            <UButton @click="recoverFromError(error)">
              Go to the Home page
            </UButton>
          </div>

        </div>

      </template>
    </NuxtErrorBoundary>

    <div class="mb-8"></div>

    <LazyLoginRegister/>
  </div>
</template>
