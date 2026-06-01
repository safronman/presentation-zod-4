<script setup lang="ts">
const items = [
  { label: "Строки", value: "14.7x", width: "100%" },
  { label: "Массивы", value: "7.4x", width: "50%" },
  { label: "Объекты", value: "6.5x", width: "44%" },
];
</script>

<template>
  <div class="zod-chart mt-8">
    <div class="mb-6 flex items-end justify-between">
      <div>
        <div class="text-sm uppercase tracking-widest text-[#9cc5ff]">Runtime parsing</div>
        <div class="mt-2 text-3xl font-bold text-white">Ускорение по типам данных</div>
      </div>
      <div class="rounded border border-[#418DFF]/30 bg-[#418DFF]/10 px-4 py-2 text-[#9cc5ff]">vs Zod 3</div>
    </div>

    <div class="space-y-5">
      <div v-for="item in items" :key="item.label" v-click class="grid grid-cols-[8rem_1fr_5rem] items-center gap-5">
        <div class="text-xl font-semibold text-white">{{ item.label }}</div>
        <div class="h-5 overflow-hidden rounded-full border border-[#418DFF]/25 bg-white/8">
          <div class="perf-bar h-full rounded-full" :style="{ '--bar-width': item.width }"></div>
        </div>
        <div class="text-right text-2xl font-bold text-[#9cc5ff]">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>
