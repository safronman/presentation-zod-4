---
theme: seriph
title: Что нового в Zod 4
info: |
  ## Что нового в Zod 4

  Доклад для разработчиков о ключевых изменениях Zod 4:
  производительность, TypeScript, Zod Mini, JSON Schema, metadata registry,
  file schemas, versioning и новые API.
class: text-left
drawings:
  persist: false
transition: slide-left
comark: true
duration: 35min
lineNumbers: true
colorSchema: dark
highlighter: shiki
shiki:
  theme: github-dark
---

<div class="absolute inset-0 bg-cover bg-center" style="background-image: url('/images/zod-cover-2.png')"></div>
<div class="absolute inset-0 bg-[#050914]/82"></div>
<div class="absolute inset-0 opacity-25" style="background-image: linear-gradient(rgba(65, 141, 255, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(65, 141, 255, 0.12) 1px, transparent 1px); background-size: 42px 42px;"></div>

<div
  class="absolute left-[76%] top-[55%] z-10 h-52 w-52 -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat drop-shadow-[0_0_42px_rgba(65,141,255,0.42)]"
  aria-label="Zod"
  style="background-image: url('/images/logo.png')"
></div>

<div class="relative z-10 flex h-full w-[64%] flex-col justify-center px-16 py-14 text-white">

  <h1 class="mb-5 whitespace-nowrap text-5xl font-bold leading-tight">
    Что нового в <span class="text-[#418DFF]">Zod 4</span>
  </h1>

  <p class="max-w-2xl text-xl leading-8 text-slate-200">
    Что изменилось, зачем это важно и как выглядит код после обновления.
  </p>

  <div class="mt-12 grid max-w-3xl grid-cols-3 gap-4 text-center">
    <div class="rounded border border-[#418DFF]/35 bg-white/5 p-4 backdrop-blur">
      <div class="text-2xl font-bold text-[#418DFF]">14.7x</div>
      <div class="text-sm text-slate-300">быстрее строки</div>
    </div>
    <div class="rounded border border-[#418DFF]/35 bg-white/5 p-4 backdrop-blur">
      <div class="text-2xl font-bold text-[#418DFF]">-57%</div>
      <div class="text-sm text-slate-300">gzip bundle</div>
    </div>
    <div class="rounded border border-[#418DFF]/35 bg-white/5 p-4 backdrop-blur">
      <div class="text-2xl font-bold text-[#418DFF]">v3 + v4</div>
      <div class="text-sm text-slate-300">параллельные импорты</div>
    </div>
  </div>
</div>

---
layout: two-cols-header
---

# Главная идея Zod 4

Zod 4 не пытается поменять привычную модель работы. Он сохраняет знакомый API, но
переписывает внутренности: быстрее парсит, меньше нагружает TypeScript и лучше
подходит для production bundle.

::left::

## Что улучшается

<v-clicks>

- производительность runtime-парсинга
- скорость и устойчивость `tsc`
- размер клиентского бандла
- JSON Schema без сторонних пакетов
- метаданные для документации и OpenAPI

</v-clicks>

::right::

## Что остается знакомым

```ts {all}
import * as z from "zod";

const User = z.object({
  name: z.string(),
  age: z.number(),
});

User.parse({ name: "Alice", age: 30 });
```

---

# TypeScript inference

Zod строит runtime-схему, а TypeScript получает из нее статический тип через
`z.infer`.

```ts twoslash
import * as z from "zod";

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

type User = z.infer<typeof UserSchema>;
//   ^?

const user: User = {
  name: "Alice",
  age: 30,
};
```

---

# 1. Парсинг стал быстрее

Переписанный движок парсинга дает кратный прирост без изменения API.

Zod 3 и Zod 4: код выглядит одинаково. Разница находится внутри библиотеки.

<PerformanceBars />

---
layout: two-cols-header
---

# 2. TypeScript-компилятору стало легче

В Zod 3 цепочки `.extend()` и `.omit()` могли резко увеличивать число инстанциаций
типов. В Zod 4 эта нагрузка существенно снижена.

::left::

### 🧱 Было: Zod 3

```ts
import * as z from "zod";

const a = z.object({ a: z.string(), b: z.string() });
const b = a.omit({ a: true });
const c = b.extend({ a: z.string() });
const d = c.omit({ a: true });

// Дальше: медленная компиляция
// или ошибка "Possibly infinite"
```

::right::

### ⚡ Стало: Zod 4

```ts
import * as z from "zod";

const a = z.object({ a: z.string(), b: z.string() });
const b = a.omit({ a: true });
const c = b.extend({ a: z.string() });
const d = c.omit({ a: true });
const e = d.extend({ a: z.string() });

// Те же цепочки, но tsc работает быстрее
```

---

# 3. Меньше размер бандла

<BundleChart />

Главный вывод: меньше JavaScript в браузере без переписывания пользовательского кода.

---
layout: two-cols-header
---

# 4. Zod Mini

`zod/mini` — новый ультралегкий вариант с функциональным API. Он лучше
tree-shakes и особенно полезен на фронтенде, где важен каждый килобайт.

::left::

### 🧩 Обычный API

```ts
import * as z from "zod";

const schema = z.string().optional();
const arr = z.array(z.string()).min(1).max(10);
const obj = z.object({ name: z.string() }).extend({
  age: z.number(),
});
```

::right::

### 🪶 Zod Mini

```ts
import * as z from "zod/mini";

const schema = z.optional(z.string());
const arr = z.array(z.string()).check(z.minLength(1), z.maxLength(10));
const obj = z.extend(z.object({ name: z.string() }), {
  age: z.number(),
});
```

---

# Zod Mini: что важно запомнить

```ts
import * as z from "zod/mini";

const User = z.object({ name: z.string() });

User.parse({ name: "Alice" });
```

<v-clicks>

- `zod/mini` использует функциональный стиль вместо цепочек методов.
- Методы парсинга остаются привычными: `.parse()`, `.safeParse()`, `.parseAsync()`.
- Для минимального скрипта размер около **2 KB gzip**.
- Это примерно в **6.6 раза меньше**, чем Zod 3 в аналогичном сценарии.

</v-clicks>

---
layout: two-cols-header
---

# 5. JSON Schema теперь встроен

Раньше для генерации JSON Schema нужен был отдельный пакет. В Zod 4 это часть
основного API.

❗ Вместо пакета `zodToJsonSchema` используется нативный метод `toJSONSchema`

````md magic-move [schema.ts]
```ts
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const schema = z.object({
  name: z.string(),
  age: z.number().int().min(0),
});

const jsonSchema = zodToJsonSchema(schema);
```

```ts
import * as z from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number().int().min(0),
});

const jsonSchema = z.toJSONSchema(schema);
```
````

---

# 6. Metadata registry

Zod 4 добавляет реестр метаданных для схем. Это удобно, когда схема используется не
только для валидации, но и для генерации документации.

```ts {3-6|8-11|13-16|18-21|all}
import * as z from "zod";

const registry = new z.ZodRegistry<{
  description: string;
  example?: unknown;
}>();

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

registry.add(UserSchema, {
  description: "Схема пользователя",
  example: { name: "Alice", age: 30 },
});

const nameSchema = z.string().meta({
  description: "Имя",
  example: "Alice",
});
```

---
layout: two-cols-header
---

# 7. Нативная схема для файлов

`z.file()` заменяет ручную комбинацию `instanceof(File)` и нескольких `refine()`.

### 🧱 Было: Zod 3

```ts
import * as z from "zod";

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Файл не должен превышать 5MB",
  })
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "Только JPEG и PNG",
  });
```

<SlideSpacer />
  
### ⚡ Стало: Zod 4

```ts
import * as z from "zod";

const fileSchema = z
  .file()
  .min(1)
  .max(5 * 1024 * 1024)
  .mime(["image/jpeg", "image/png"]);
```

---

# 8. TypeScript-ошибки стали понятнее

Zod 4 упростил внутренние generic-типы. За счет этого TypeScript чаще показывает
короткую ошибку по сути, а не длинную цепочку вложенных типов.

```diff
 const schema = z.object({ name: z.string() });
 schema.parse(42);

- TS Error: Argument of type 'number' is not assignable to parameter of type
- '{ name: string } | Promise<...>' плюс длинная цепочка generic-типов
+ TS Error: Argument of type 'number' is not assignable to parameter of type
+ '{ name: string }'
```

Для разработчика это означает меньше времени на чтение type noise и быстрее поиск
реальной ошибки.

```ts twoslash
import * as z from "zod";

const schema = z.object({ name: z.string() });
type User = z.infer<typeof schema>;

// @errors: 2322
const user: User = { name: 42 };
```

---
class: text-center final-slide
---

<div
  class="absolute inset-0 bg-cover bg-center"
  style="background-image: url('/images/zod-cover.png')"
></div>
<div class="absolute inset-0 bg-[#050914]/90"></div>

<div class="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-center text-center text-white">
  <h1 class="text-7xl font-bold leading-tight">Итог</h1>

  <p class="mx-auto mt-8 max-w-3xl text-3xl !leading-[1.2] text-white">
    Zod 4 — более быстрый и практичный фундамент для уже знакомого подхода к schema validation.
  </p>

  <ul class="mx-auto mt-12 grid max-w-3xl list-none grid-cols-2 gap-x-10 gap-y-4 pl-0 text-left text-3xl font-semibold text-[#9cc5ff]">
    <li class="list-none">✅ Быстрее runtime</li>
    <li class="list-none">✅ Легче TypeScript</li>
    <li class="list-none">✅ Меньше bundle</li>
    <li class="list-none">✅ Лучше tooling</li>
  </ul>
</div>
