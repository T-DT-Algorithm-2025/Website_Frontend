<template>
  <transition name="fade">
    <div
      v-if="alertState.show"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      @click.self="hideAlert"
    >
      <transition name="pop">
        <div
          v-if="alertState.show"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md text-center transform"
        >
          <!-- Icon -->
          <div class="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center" :class="alertClasses.iconBg">
            <svg v-if="alertState.type === 'success'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <svg v-if="alertState.type === 'error'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            <svg v-if="alertState.type === 'info'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-bold mb-2 dark:text-white" :class="alertClasses.title">{{ title }}</h3>

          <!-- Message -->
          <p class="text-gray-600 dark:text-gray-300">{{ alertState.message }}</p>

          <!-- Close Button -->
          <button
            @click="hideAlert"
            class="mt-6 w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            :class="alertClasses.button"
          >
            关闭
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAlert } from '@/composables/useAlert'

const { alertState, hideAlert } = useAlert()

const title = computed(() => {
  switch (alertState.type) {
    case 'success':
      return '成功'
    case 'error':
      return '错误'
    default:
      return '提示'
  }
})

const alertClasses = computed(() => {
  switch (alertState.type) {
    case 'success':
      return {
        title: 'text-green-600 dark:text-green-400',
        button: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
        iconBg: 'bg-green-500'
      }
    case 'error':
      return {
        title: 'text-red-600 dark:text-red-400',
        button: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
        iconBg: 'bg-red-500'
      }
    default:
      return {
        title: 'text-blue-600 dark:text-blue-400',
        button: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
        iconBg: 'bg-blue-500'
      }
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.pop-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
