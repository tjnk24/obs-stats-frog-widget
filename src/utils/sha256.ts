// Plain-JS SHA-256, used only if the browser hides crypto.subtle from local (file:///) pages.

const K: number[] = [];
const H0: number[] = [];

// round constants and initial hash: fractional parts of cube and square roots of the first primes
for (let n = 2, found = 0; found < 64; n++) {
    let isPrime = true;

    for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
            isPrime = false;
            break;
        }
    }

    if (!isPrime) {
        continue;
    }

    if (found < 8) {
        H0[found] = ((Math.pow(n, 1 / 2) % 1) * 4294967296) | 0;
    }

    K[found++] = ((Math.pow(n, 1 / 3) % 1) * 4294967296) | 0;
}

const ror = (x: number, n: number) => (x >>> n) | (x << (32 - n));

export const sha256Fallback = (bytes: Uint8Array) => {
    const length = bytes.length;
    const buffer = new Uint8Array(((length + 9 + 63) >> 6) << 6);

    buffer.set(bytes);
    buffer[length] = 0x80;

    const view = new DataView(buffer.buffer);

    view.setUint32(buffer.length - 8, Math.floor(length / 0x20000000));
    view.setUint32(buffer.length - 4, (length * 8) >>> 0);

    const hash = H0.slice();
    const w = new Int32Array(64);

    for (let offset = 0; offset < buffer.length; offset += 64) {
        for (let i = 0; i < 16; i++) {
            w[i] = view.getInt32(offset + (i * 4));
        }

        for (let i = 16; i < 64; i++) {
            const x = w[i - 15];
            const y = w[i - 2];

            w[i] = w[i - 16] + (ror(x, 7) ^ ror(x, 18) ^ (x >>> 3)) + w[i - 7] + (ror(y, 17) ^ ror(y, 19) ^ (y >>> 10));
        }

        let [a, b, c, d, e, f, g, h] = hash;

        for (let i = 0; i < 64; i++) {
            const t1 = (h + (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
            const t2 = ((ror(a, 2) ^ ror(a, 13) ^ ror(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;

            h = g;
            g = f;
            f = e;
            e = (d + t1) | 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) | 0;
        }

        [a, b, c, d, e, f, g, h].forEach((value, i) => {
            hash[i] = (hash[i] + value) | 0;
        });
    }

    const result = new Uint8Array(32);
    const resultView = new DataView(result.buffer);

    hash.forEach((value, i) => resultView.setInt32(i * 4, value));

    return result;
};

export const sha256 = async (text: string) => {
    const bytes = new TextEncoder().encode(text);

    if (window.crypto?.subtle) {
        return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    }

    return sha256Fallback(bytes);
};
