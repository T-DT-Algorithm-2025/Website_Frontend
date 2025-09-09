<!-- 自定义选择框组件，与IInput风格保持一致 -->
<template>
  <div
    ref="selectContainerRef"
    :class="cn('group/select rounded-lg p-[2px] transition duration-300', props.containerClass)"
    :style="{
      background: containerBg,
    }"
    @mouseenter="() => (visible = true)"
    @mouseleave="() => (visible = false)"
    @mousemove="handleMouseMove"
  >
    <select
      v-bind="$attrs"
      v-model="modelValue"
      :class="
        cn(
          `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm
          focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
          disabled:cursor-not-allowed disabled:opacity-50
          dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
          group-hover/select:shadow-none transition duration-400`,
          props.class,
        )
      "
    >
      <slot />
    </select>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { useVModel } from "@vueuse/core";
import { ref, computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  containerClass?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

const selectContainerRef = ref<HTMLDivElement | null>(null);
const mouse = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const radius = 100;
const visible = ref(false);

const containerBg = computed(() => {
  return `
        radial-gradient(
          ${visible.value ? radius + "px" : "0px"} circle at ${mouse.value.x}px ${mouse.value.y}px,
          var(--blue-500),
          transparent 80%
        )
      `;
});

function handleMouseMove({ clientX, clientY }: MouseEvent) {
  if (!selectContainerRef.value) return;

  const { left, top } = selectContainerRef.value.getBoundingClientRect();
  mouse.value = { x: clientX - left, y: clientY - top };
}
</script>

<style scoped>
select {
  box-shadow:
    0px 2px 3px -1px rgba(0, 0, 0, 0.1),
    0px 1px 0px 0px rgba(25, 28, 33, 0.02),
    0px 0px 0px 1px rgba(25, 28, 33, 0.08);
}

/* 自定义选择框箭头样式 */
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

/* 暗色模式下的箭头颜色 */
.dark select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}
</style>
