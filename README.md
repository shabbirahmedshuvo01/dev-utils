# @dev_shuvo/dev-utils

A lightweight, framework-independent TypeScript utility library for common tasks in modern JavaScript and TypeScript applications.

It provides small, reusable helpers for error handling, performance, dates, API query strings, pagination, object cleanup, retries, browser storage, and sensitive-data masking.

## Features

- Type-safe TypeScript utilities
- No framework dependency
- Browser and Node.js friendly where applicable
- Small, focused APIs
- ESM package support
- Built-in TypeScript declarations
- Useful for React, Next.js, Node.js, Express, and other TypeScript projects

---

## Installation

Replace `@dev_shuvo/dev-utils` with your published package name.

```bash
npm install @dev_shuvo/dev-utils
```

Or:

```bash
yarn add @dev_shuvo/dev-utils
```

Or:

```bash
pnpm add @dev_shuvo/dev-utils
```

---

# Utilities

## 1. `getErrorMessage`

Safely extracts a useful message from an `unknown` error.

This is especially useful with TypeScript because values caught in a `catch` block should be treated as `unknown`.

### Usage

```ts
import { getErrorMessage } from "@dev_shuvo/dev-utils";

try {
  await fetchUser();
} catch (error) {
  console.error(getErrorMessage(error));
}
```

It works with different error values:

```ts
getErrorMessage(new Error("Something went wrong"));
// "Something went wrong"

getErrorMessage("Network error");
// "Network error"

getErrorMessage({ message: "Unauthorized" });
// "Unauthorized"

getErrorMessage(null);
// "An unknown error occurred"
```

You can provide your own fallback:

```ts
getErrorMessage(error, "Unable to complete request");
```

---

# 2. `debounce`

Delays function execution until the specified amount of time has passed without another call.

Useful for:

- Search inputs
- API search requests
- Window resize
- Scroll handlers
- Expensive calculations

### Usage

```ts
import { debounce } from "@dev_shuvo/dev-utils";

const searchUsers = debounce((search: string) => {
  console.log("Searching:", search);
}, 500);

searchUsers("john");
searchUsers("john d");
searchUsers("john doe");
```

Only the final call is executed after 500ms.

### Cancel

```ts
searchUsers.cancel();
```

### Execute immediately

```ts
searchUsers.flush();
```

---

# 3. `formatIsoString`

Formats ISO strings, timestamps, or JavaScript `Date` objects using the native `Intl.DateTimeFormat` API.

### Usage

```ts
import { formatIsoString } from "@dev_shuvo/dev-utils";

const date = formatIsoString("2026-08-23T10:30:00.000Z");

console.log(date);
```

You can specify a locale:

```ts
formatIsoString("2026-08-23T10:30:00.000Z", {
  locale: "en-US"
});
```

You can specify a timezone:

```ts
formatIsoString("2026-08-23T10:30:00.000Z", {
  locale: "en-US",
  timeZone: "Asia/Dhaka"
});
```

You can also control date and time styles:

```ts
formatIsoString("2026-08-23T10:30:00.000Z", {
  locale: "en-US",
  timeZone: "Asia/Dhaka",
  dateStyle: "long",
  timeStyle: "short"
});
```

---

# 4. `formatRelativeTime`

Converts a date into human-readable relative time.

### Usage

```ts
import { formatRelativeTime } from "@dev_shuvo/dev-utils";

formatRelativeTime("2026-08-23T10:00:00Z");
```

Depending on the current time, the result can be:

```text
2 hours ago
```

or:

```text
in 2 hours
```

You can specify a locale:

```ts
formatRelativeTime(
  "2026-08-23T10:00:00Z",
  "en"
);
```

For testing, you can provide a fixed `now` timestamp:

```ts
const now = Date.parse("2026-08-23T10:00:00Z");

formatRelativeTime(
  "2026-08-23T11:00:00Z",
  "en",
  now
);

// "in 1 hour"
```

---

# 5. `buildQueryParams`

Converts objects, arrays, and nested objects into URL query parameters.

### Basic usage

```ts
import { buildQueryParams } from "@dev_shuvo/dev-utils";

const query = buildQueryParams({
  page: 1,
  limit: 20,
  search: "john"
});

console.log(query);
```

Result:

```text
?page=1&limit=20&search=john
```

### Arrays

```ts
const query = buildQueryParams({
  tags: ["react", "typescript", "nextjs"]
});
```

Result:

```text
?tags=react&tags=typescript&tags=nextjs
```

### Nested objects

```ts
const query = buildQueryParams({
  filters: {
    status: "active",
    role: "admin"
  }
});
```

Result:

```text
?filters%5Bstatus%5D=active&filters%5Brole%5D=admin
```

The function uses `URLSearchParams`, so values are safely URL encoded.

### Array formats

Repeat parameters:

```ts
buildQueryParams(
  {
    tags: ["react", "typescript"]
  },
  {
    arrayFormat: "repeat"
  }
);
```

Bracket format:

```ts
buildQueryParams(
  {
    tags: ["react", "typescript"]
  },
  {
    arrayFormat: "brackets"
  }
);
```

Comma-separated:

```ts
buildQueryParams(
  {
    tags: ["react", "typescript"]
  },
  {
    arrayFormat: "comma"
  }
);
```

### Empty values

By default, `null`, `undefined`, and empty strings are skipped.

You can change this behavior:

```ts
buildQueryParams(
  {
    search: "",
    status: null,
    page: 1
  },
  {
    skipEmptyString: false,
    skipNull: false
  }
);
```

---

# 6. `getPaginationMetadata`

Calculates common pagination values from the total number of records, page number, and page size.

### Usage

```ts
import { getPaginationMetadata } from "@dev_shuvo/dev-utils";

const pagination = getPaginationMetadata(
  125,
  2,
  20
);

console.log(pagination);
```

Result:

```ts
{
  page: 2,
  limit: 20,
  total: 125,
  totalPages: 7,
  skip: 20,
  hasNextPage: true,
  hasPreviousPage: true
}
```

### Database example

```ts
const pagination = getPaginationMetadata(
  totalUsers,
  page,
  limit
);

const users = await prisma.user.findMany({
  skip: pagination.skip,
  take: pagination.limit
});
```

The same metadata can be used with MongoDB, PostgreSQL, MySQL, or other database systems.

---

# 7. `cleanObject`

Removes unwanted values from objects before sending or storing data.

By default it removes:

- `null`
- `undefined`
- empty strings

### Usage

```ts
import { cleanObject } from "@dev_shuvo/dev-utils";

const payload = cleanObject({
  name: "John",
  email: "",
  phone: null,
  age: undefined,
  country: "Bangladesh"
});

console.log(payload);
```

Result:

```ts
{
  name: "John",
  country: "Bangladesh"
}
```

### Useful for API payloads

```ts
const payload = cleanObject({
  name: form.name,
  email: form.email,
  phone: form.phone,
  address: form.address
});

await api.updateUser(payload);
```

### Remove empty arrays

```ts
cleanObject(
  {
    name: "John",
    tags: []
  },
  {
    removeEmptyArrays: true
  }
);
```

### Remove empty objects

```ts
cleanObject(
  {
    name: "John",
    profile: {}
  },
  {
    removeEmptyObjects: true
  }
);
```

---

# 8. `retryAsync`

Retries a failed asynchronous operation using exponential backoff.

Useful for:

- API requests
- Microservices
- Temporary network failures
- External service calls

### Basic usage

```ts
import { retryAsync } from "@dev_shuvo/dev-utils";

const data = await retryAsync(
  () => fetchUser()
);
```

The default behavior retries failed operations up to 3 times.

### Configure retries

```ts
const data = await retryAsync(
  () => fetchUser(),
  {
    retries: 5,
    minDelay: 500,
    maxDelay: 5000,
    factor: 2
  }
);
```

The delay increases approximately like:

```text
500ms
1000ms
2000ms
4000ms
...
```

### Retry condition

You can decide whether a particular error should be retried:

```ts
const data = await retryAsync(
  () => fetchUser(),
  {
    retries: 3,

    shouldRetry: (error, attempt) => {
      console.log("Retry attempt:", attempt);

      return true;
    }
  }
);
```

### Retry callback

```ts
await retryAsync(
  () => fetchUser(),
  {
    retries: 3,

    onRetry: (error, attempt, delay) => {
      console.log(
        `Retry #${attempt} in ${delay}ms`
      );
    }
  }
);
```

---

# 9. `convertTimezone`

Formats a timestamp according to an IANA timezone.

Examples of IANA timezones:

```text
Asia/Dhaka
Asia/Kolkata
Europe/London
America/New_York
America/Los_Angeles
Australia/Sydney
```

### Usage

```ts
import { convertTimezone } from "@dev_shuvo/dev-utils";

const date = convertTimezone(
  "2026-08-23T10:00:00Z",
  "Asia/Dhaka"
);

console.log(date);
```

### Specify locale

```ts
convertTimezone(
  "2026-08-23T10:00:00Z",
  "Europe/London",
  "en-GB"
);
```

### Custom formatting

```ts
convertTimezone(
  "2026-08-23T10:00:00Z",
  "Asia/Dhaka",
  "en-US",
  {
    dateStyle: "full",
    timeStyle: "short"
  }
);
```

---

# 10. `safeStorage`

Provides a safe wrapper around browser `localStorage`.

It supports:

- JSON serialization
- TTL / expiration
- Safe error handling
- `set`
- `get`
- `remove`
- `clear`

### Usage

```ts
import { safeStorage } from "@dev_shuvo/dev-utils";

const storage = safeStorage();

storage.set("user", {
  id: 123,
  name: "John"
});

const user = storage.get<{
  id: number;
  name: string;
}>("user");

console.log(user);
```

### TTL

You can automatically expire stored values.

```ts
storage.set(
  "session",
  {
    userId: 123
  },
  60_000
);
```

The value expires after 60 seconds.

After expiration:

```ts
storage.get("session");
```

returns:

```ts
null
```

### Remove

```ts
storage.remove("session");
```

### Clear

```ts
storage.clear();
```

### Custom storage

This is useful for testing or custom browser storage implementations:

```ts
const storage = safeStorage({
  storage: window.localStorage
});
```

The function safely handles environments where `localStorage` is unavailable.

---

# 11. `maskData`

Recursively masks sensitive data before logging objects.

This is particularly useful for:

- API logs
- Debugging
- Server logs
- Error tracking
- Development environments

### Usage

```ts
import { maskData } from "@dev_shuvo/dev-utils";

const safeData = maskData({
  username: "john",
  password: "super-secret",
  token: "abcdef123456",
  email: "john@example.com"
});

console.log(safeData);
```

Sensitive values are masked.

### Nested objects

The masking works recursively:

```ts
const safeData = maskData({
  user: {
    name: "John",
    credentials: {
      password: "super-secret",
      token: "abcdef123456"
    }
  }
});
```

### Default sensitive keys

The package recognizes keys such as:

```text
password
passwd
token
accessToken
refreshToken
authorization
jwt
secret
apiKey
cookie
```

### Custom sensitive keys

You can provide your own list:

```ts
maskData(
  {
    username: "john",
    employeeId: "EMP-123",
    privateKey: "very-secret-value"
  },
  {
    keys: ["employeeId", "privateKey"]
  }
);
```

### Customize visible characters

```ts
maskData(
  {
    token: "abcdef123456"
  },
  {
    visibleStart: 1,
    visibleEnd: 3
  }
);
```

---

# Complete Example

A typical API service might use several utilities together:

```ts
import {
  getErrorMessage,
  buildQueryParams,
  cleanObject,
  retryAsync,
  maskData
} from "@dev_shuvo/dev-utils";

interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
}

async function getUsers(filters: UserFilters) {
  const cleanFilters = cleanObject(filters);

  const query = buildQueryParams({
    page: 1,
    limit: 20,
    filters: cleanFilters
  });

  try {
    return await retryAsync(
      async () => {
        const response = await fetch(
          `/api/users${query}`
        );

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        return response.json();
      },
      {
        retries: 3,
        minDelay: 500
      }
    );
  } catch (error) {
    console.error(
      "User API error:",
      maskData({
        message: getErrorMessage(error),
        filters: cleanFilters
      })
    );

    throw error;
  }
}
```

---

# React / Next.js Example

The package is framework-independent, so it can be used inside React or Next.js projects.

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  debounce,
  safeStorage
} from "@dev_shuvo/dev-utils";

export default function UserSearch() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchUsers = debounce(
      (value: string) => {
        console.log("Searching:", value);
      },
      500
    );

    searchUsers(search);

    return () => {
      searchUsers.cancel();
    };
  }, [search]);

  return (
    <input
      value={search}
      onChange={(event) => {
        setSearch(event.target.value);
      }}
      placeholder="Search users..."
    />
  );
}
```

For browser storage:

```tsx
"use client";

import { safeStorage } from "@dev_shuvo/dev-utils";

const storage = safeStorage();

storage.set(
  "preferences",
  {
    theme: "dark"
  },
  24 * 60 * 60 * 1000
);

const preferences = storage.get("preferences");
```

---

# API Summary

| Function | Purpose |
|---|---|
| `getErrorMessage()` | Safely extract an error message |
| `debounce()` | Delay frequently triggered functions |
| `formatIsoString()` | Format ISO/database dates |
| `formatRelativeTime()` | Convert dates to human-readable relative time |
| `buildQueryParams()` | Build encoded query strings |
| `getPaginationMetadata()` | Calculate pagination information |
| `cleanObject()` | Remove unwanted object values |
| `retryAsync()` | Retry failed async operations |
| `convertTimezone()` | Format dates in a specific timezone |
| `safeStorage()` | Safe browser storage with TTL |
| `maskData()` | Mask sensitive information recursively |

---

# TypeScript

The package is written in TypeScript and publishes declaration files automatically.

You can use full type inference:

```ts
const pagination = getPaginationMetadata(
  100,
  1,
  10
);

pagination.totalPages;
pagination.hasNextPage;
pagination.skip;
```

---

# Development

Clone the repository and install dependencies:

```bash
npm install
```

Run TypeScript validation:

```bash
npm run typecheck
```

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Build the package:

```bash
npm run build
```

The compiled package will be generated inside:

```text
dist/
```

---

# Publishing to npm

Before publishing, update the package name in `package.json`.

For example:

```json
{
  "name": "your-package-name",
  "version": "1.0.0"
}
```

Log in to npm:

```bash
npm login
```

Verify what will be included:

```bash
npm pack --dry-run
```

Publish:

```bash
npm publish
```

For a scoped public package:

```bash
npm publish --access public
```

---

# Versioning

Update the package version when releasing changes:

```bash
npm version patch
```

For a new minor feature:

```bash
npm version minor
```

For a breaking change:

```bash
npm version major
```

Then publish:

```bash
npm publish
```

---

# License

MIT
