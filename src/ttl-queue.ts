import { Deque } from '@zimtsui/deque';


interface Item<T> {
    value: T;
    time: number;
}

export class TtlQueue<T> implements Iterable<T> {
    private q = new Deque<Item<T>>();

    public constructor(
        private ttl: number,
        private now: () => number = Date.now,
    ) { }

    private clean(): void {
        while (
            this.q.getSize() &&
            this.now() > this.q.i(0).time + this.ttl
        ) this.q.shift();
    }

    /**
     * @throws RangeError
     * @param index - Can be negative.
     */
    public i(index: number): T {
        this.clean();
        return this.q.i(index).value;
    }

    public push(x: T): void {
        this.q.push({
            value: x,
            time: this.now(),
        });
        this.clean();
    }

    public getSize(): number {
        return this.q.getSize();
    }

    /**
     * Time complexity O(n)
     */
    public [Symbol.iterator]() {
        this.clean();
        return [...this.q].map(
            item => item.value,
        )[Symbol.iterator]();
    }
}
