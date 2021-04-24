function baseLog(x: number, base: number) {
    return Math.log(x) / Math.log(base) // https://en.wikipedia.org/wiki/Logarithm#Change_of_base
}

/**
 * 
 * @param n number to convert as an array of the value in each place. e.g. [1, 0, 1] for 5 in binary
 * @param from_base the base to convert from. e.g. 16 for hexadecimal
 * @param to_base the base to convert to. e.g. 2 for binary
 * @returns 
 */
export function convertBase(n: Uint8Array, from_base: number, to_base: number) {
    let total: number = 0;

    for (let i = 0; i < n.length; i++) {
        console.log(Math.pow(from_base, i));
        total += n[i] * Math.pow(from_base, (n.length - 1) - i);
    }

    console.log(total);

    if (total === 0) { return new Uint8Array(0); }

    const digits = Math.ceil(baseLog(total, to_base));
    const result = new Uint8Array(digits);
    let remaining = total;
    console.log(digits);
    console.log(baseLog(total, to_base))
    console.log(result);
    console.log(remaining);
    console.log('start');
    for (let i = 0; i < result.length; i++) {
        result[i] = remaining % to_base;
        remaining = Math.floor(remaining / to_base);
    }

    return result;
}