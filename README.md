# ttl-queue

config

```ts
interface Config<T> {
    ttl: number;
    cleaningInterval?: number; // when falsy, ttl-queue cleans realtime
    onShift?: (element: T, time: number) => void;
    elemCarrierConstructor: {
        new(...args: any[]): RAIQI<T>;
    };
    timeCarrierConstructor: {
        new(...args: any[]): RAIQI<number>;
    };
}
```

default configuration

```ts
private config: Config<T> = {
    ttl: Number.POSITIVE_INFINITY,
    cleaningInterval: undefined,
    onShift: undefined,
    elemCarrierConstructor: Array,
    timeCarrierConstructor: Array,
};
```