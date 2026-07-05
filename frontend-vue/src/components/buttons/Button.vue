<script setup lang="ts">
const { variant = 'ink' } = defineProps<{
  variant: 'ink' | 'ghost' | 'green'
}>()

const variants = {
  ink: 'bg-(--ink) text-white',
  ghost: 'transparent border border-(--border) text-(--ink)',
  green: 'bg-(--green) text-white',
}
</script>

<template>
  <button
    type="submit"
    class="flex items-center w-full rounded-lg justify-center gap-2 px-4 py-3 cursor-pointer uppercase text-xs transition-opacity transition-transform"
    :class="variants[variant]"
  >
    <slot></slot>
  </button>
</template>
