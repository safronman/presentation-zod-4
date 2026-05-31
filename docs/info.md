# Что нового в Zod 4

> Zod v4 вышел стабильным после года разработки. Быстрее, легче, эффективнее с TypeScript — и закрывает 9 из 10 самых популярных issues на GitHub.

---

## 1. Производительность парсинга

Переписанный движок парсинга показывает кратный прирост скорости:

| Тип данных | Ускорение |
| ---------- | --------- |
| Строки     | 14.7×     |
| Массивы    | 7.4×      |
| Объекты    | 6.5×      |

Никаких изменений в API — просто быстрее «из коробки».

```ts
// Zod 3 & Zod 4 — API одинаковый, но v4 работает значительно быстрее
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

schema.parse({ name: "Alice", age: 30 });
```

---

## 2. Снижение нагрузки на TypeScript-компилятор (tsc)

В Zod 3 цепочки `.extend()` и `.omit()` вызывали «взрывной» рост инстанциаций типов и даже ошибку `"Possibly infinite"`. Zod 4 решил это полностью.

**Было (Zod 3) — >25 000 инстанциаций, компиляция ~4000ms:**

```ts
// Zod 3: повторные .extend()/.omit() вешали компилятор
import * as z from "zod";

const a = z.object({ a: z.string(), b: z.string() });
const b = a.omit({ a: true });
const c = b.extend({ a: z.string() });
const d = c.omit({ a: true });
// ... дальше — ошибка "Possibly infinite" или очень долгая компиляция
```

**Стало (Zod 4) — ~175 инстанциаций, компиляция ~400ms:**

```ts
// Zod 4: те же цепочки работают быстро и без ошибок
import * as z from "zod";

const a = z.object({ a: z.string(), b: z.string() });
const b = a.omit({ a: true });
const c = b.extend({ a: z.string() });
const d = c.omit({ a: true });
const e = d.extend({ a: z.string() });
// Компилируется в 10x быстрее, никаких ошибок
```

---

## 3. Уменьшение размера бандла

Базовый бандл (gzip) для минимального скрипта с `z.boolean()`:

| Версия | Размер   |
| ------ | -------- |
| Zod 3  | 12.47 КБ |
| Zod 4  | 5.36 КБ  |

Сокращение ~57% без каких-либо изменений в коде.

---

## 4. Zod Mini — ультралёгкий вариант

Новый пакет `zod/mini` с функциональным API, который легко tree-shakes. Рекомендуется для фронтенда с жёсткими ограничениями по размеру бандла.

**Было (Zod 3/4 — стандартный API):**

```ts
import * as z from "zod";

const schema = z.string().optional();
const arrSchema = z.array(z.string()).min(1).max(10);
const objSchema = z.object({ name: z.string() }).extend({ age: z.number() });
```

**Стало (Zod Mini — функциональный API):**

```ts
import * as z from "zod/mini";

const schema = z.optional(z.string());
const arrSchema = z.array(z.string()).check(z.minLength(1), z.maxLength(10));
const objSchema = z.extend(z.object({ name: z.string() }), { age: z.number() });
```

> Методы парсинга (`.parse()`, `.safeParse()`, `.parseAsync()`) остаются одинаковыми в обоих вариантах.

Размер бандла Zod Mini для того же минимального скрипта — около **2 КБ**, что в ~6.6 раз меньше Zod 3.

---

## 5. Встроенная конвертация в JSON Schema

В Zod 3 для генерации JSON Schema нужна была сторонняя библиотека `zod-to-json-schema`. Теперь это встроено.

**Было (Zod 3):**

```ts
import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema"; // сторонняя зависимость

const schema = z.object({
  name: z.string(),
  age: z.number().int().min(0),
});

const jsonSchema = zodToJsonSchema(schema);
```

**Стало (Zod 4):**

```ts
import * as z from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number().int().min(0),
});

const jsonSchema = z.toJSONSchema(schema); // встроено в библиотеку
```

---

## 6. Zod GlobalRegistry — реестр метаданных

Новый механизм для добавления метаданных к схемам (описания, примеры и т.д.). Особенно полезен при генерации OpenAPI-документации.

**Было (Zod 3) — метаданные прятались в `.describe()`:**

```ts
import * as z from "zod";

const UserSchema = z.object({
  name: z.string().describe("Имя пользователя"),
  age: z.number().describe("Возраст"),
});
// Метаданные ограничены строкой описания
```

**Стало (Zod 4) — полноценный реестр с произвольными данными:**

```ts
import * as z from "zod";

const registry = new z.ZodRegistry<{ description: string; example?: unknown }>();

const UserSchema = z.object({
  name: z.string(),
  age: z.number(),
});

registry.add(UserSchema, {
  description: "Схема пользователя",
  example: { name: "Alice", age: 30 },
});

// Можно также использовать глобальный реестр через .meta()
const nameSchema = z.string().meta({ description: "Имя", example: "Alice" });
```

---

## 7. Улучшенная схема для файлов

`z.file()` теперь поддерживает валидацию MIME-типов и ограничения по размеру.

**Было (Zod 3) — ограниченная поддержка File:**

```ts
// Zod 3 не имел нативной поддержки File — приходилось использовать z.instanceof(File)
import * as z from "zod";

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, { message: "Файл не должен превышать 5MB" })
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), { message: "Только JPEG и PNG" });
```

**Стало (Zod 4) — нативный z.file() с удобным API:**

```ts
import * as z from "zod";

const fileSchema = z
  .file()
  .min(1) // минимальный размер в байтах
  .max(5 * 1024 * 1024) // максимум 5MB
  .mime(["image/jpeg", "image/png"]); // допустимые MIME-типы
```

---

## 8. Улучшенные сообщения об ошибках типов

Zod 4 значительно улучшил читаемость TypeScript-ошибок. Теперь они точнее указывают на проблему.

**Было (Zod 3) — длинные непонятные ошибки:**

```ts
// При неправильном использовании TypeScript выдавал многострочные
// ошибки с глубоко вложенными дженериками, которые сложно читать
const schema = z.object({ name: z.string() });
schema.parse(42);
// TS Error: Argument of type 'number' is not assignable to parameter of type
// '{ name: string } | Promise<...>' (и ещё 10 строк вложенных типов)
```

**Стало (Zod 4) — чёткие и понятные ошибки:**

```ts
// Zod 4 упростил дженерики — ошибки стали короче и читабельнее
const schema = z.object({ name: z.string() });
schema.parse(42);
// TS Error: Argument of type 'number' is not assignable to parameter of type
// '{ name: string }'  ← просто и понятно
```

---

## 9. Новая стратегия версионирования

Zod 4 использует подход, схожий с Go: публикация через субпути, чтобы избежать «лавины обновлений» в экосистеме.

```ts
// Можно использовать обе версии одновременно в период миграции
import * as z3 from "zod/v3"; // Zod 3
import * as z4 from "zod/v4"; // Zod 4

// Сейчас zod@4 — это уже основной пакет:
import * as z from "zod"; // = Zod 4
```

---

## 10. Новое в Zod 4.3 (декабрь 2025)

- **`fromJSONSchema`** — конвертация JSON Schema обратно в Zod-схему
- **`z.xor()`** — эксклюзивный union (XOR)
- **`z.looseRecord()`** — запись с нестрогими ключами
- **`z.exactOptional()`** — точная опциональность (отличает `undefined` от отсутствия ключа)
- **`z.slugify()`** — трансформ для создания slug-строк

```ts
// fromJSONSchema — новинка v4.3
import * as z from "zod";

const jsonSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" },
  },
};

const zodSchema = z.fromJSONSchema(jsonSchema);
// Теперь можно конвертировать в обе стороны!

// xor — эксклюзивный union
const schema = z.xor(
  z.object({ type: z.literal("a"), valueA: z.string() }),
  z.object({ type: z.literal("b"), valueB: z.number() })
);
```

---

## Как обновиться

```bash
npm install zod@^4.0.0
```

Полный список breaking changes — в [Migration Guide](https://zod.dev/v4/changelog).
