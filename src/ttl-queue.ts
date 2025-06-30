interface Item<T> {
	value: T;
	time: number;
}

export class TTLQueue<T> implements Iterable<T> {
	private v: Item<T>[] = [];
	private front = 0;

	/**
	 * @param ttl Number.POSITIVE_INFINITY for never removing.
	 * @param now The function to get current timestamp.
	 */
	public constructor(
		private ttl: number,
		private now: () => number = Date.now,
	) { }

	private clean(): void {
		while (this.front < this.v.length && this.now() > this.v[this.front]!.time + this.ttl) this.front++;
		if (this.front+this.front > this.v.length) this.v = this.v.slice(this.front);
	}

	public push(x: T): void {
		this.v.push({
			value: x,
			time: this.now(),
		});
		this.clean();
	}

	public getSize(): number {
		this.clean();
		return this.v.length - this.front;
	}

	public *[Symbol.iterator](): Generator<T, void, void> {
		this.clean();
		for (let i = this.front; i < this.v.length; i++) yield this.v[i]!.value;
	}
}
