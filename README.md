# ttl-queue

This is a queue which periodically cleans the eldest items. 

Its support for negative subscripts is implemented via Proxy. So it's not a standard es6 class. You should not conduct advanced operations such as inheritance.

config interface

```ts
interface Config<T> {
    ttl: number;
    cleaningInterval?: number; // 0 for cleaning realtime
    onShift?: (element: T, time: number) => void;
}
```

default configuration

```ts
private config: Config<T> = {
    ttl: Number.POSITIVE_INFINITY,
    cleaningInterval: 0,
    onShift: undefined,
};
```
