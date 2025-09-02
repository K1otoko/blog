<template>
  <div class="userView">userView</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

import { useUserStore } from '@/stores'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.getUserList()
  console.log(userStore.userList)
})
</script>
<style scoped></style>
