<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: string;
  }>(),
  {
    size: "h-6",
  }
);
</script>

<template>
  <div :class="size" aria-hidden="true"></div>
</template>
