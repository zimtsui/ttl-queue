export class TTLQueue {
    ttl;
    now;
    v = [];
    front = 0;
    /**
     * @param ttl Number.POSITIVE_INFINITY for never removing.
     * @param now The function to get current timestamp.
     */
    constructor(ttl, now = Date.now) {
        this.ttl = ttl;
        this.now = now;
    }
    clean() {
        while (this.front < this.v.length && this.now() > this.v[this.front].time + this.ttl)
            this.front++;
        if (this.front + this.front > this.v.length)
            this.v = this.v.slice(this.front);
    }
    push(x) {
        this.v.push({
            value: x,
            time: this.now(),
        });
        this.clean();
    }
    getSize() {
        this.clean();
        return this.v.length - this.front;
    }
    *[Symbol.iterator]() {
        this.clean();
        for (let i = this.front; i < this.v.length; i++)
            yield this.v[i].value;
    }
}
//# sourceMappingURL=ttl-queue.js.map