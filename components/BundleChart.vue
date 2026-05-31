<template>
  <div class="zod-chart mt-7">
    <div class="mb-5 flex items-end justify-between">
      <div>
        <div class="text-sm uppercase tracking-widest text-[#9cc5ff]">Bundle size, gzip</div>
        <div class="mt-2 text-3xl font-bold text-white">Zod 4 стал легче на ~57%</div>
      </div>
      <div class="rounded border border-[#418DFF]/30 bg-[#418DFF]/10 px-4 py-2 text-[#9cc5ff]">KB</div>
    </div>

    <div class="zod-vertical-chart">
      <div class="zod-column">
        <div class="zod-column-stage">
          <div v-click class="zod-column-bar zod-column-bar-muted" style="--bar-height: 100%"></div>
        </div>
        <div class="mt-4 text-center">
          <div class="font-semibold text-white">Zod 3</div>
          <div class="text-sm text-slate-300">12.47 KB</div>
        </div>
      </div>

      <div class="zod-column">
        <div class="zod-column-stage">
          <div v-click class="zod-column-bar" style="--bar-height: 43%"></div>
        </div>
        <div class="mt-4 text-center">
          <div class="font-semibold text-white">Zod 4</div>
          <div class="text-sm text-slate-300">5.36 KB</div>
        </div>
      </div>
    </div>
  </div>
</template>
