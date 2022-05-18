import { Deque } from 'deque';


interface Elem<T> {
    item: T;
    time: number;
}

export class TtlQueue<T> implements Iterable<T> {
    private q = new Deque<Elem<T>>();

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

    public i(index: number): T {
        this.clean();
        return this.q.i(index).item;
    }

    public push(x: T): void {
        this.q.push({
            item: x,
            time: this.now(),
        });
        this.clean();
    }

    public getSize(): number {
        return this.q.getSize();
    }

    public [Symbol.iterator]() {
        this.clean();
        return [...this.q].map(
            elem => elem.item,
        )[Symbol.iterator]();
    }
}
