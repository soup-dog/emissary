import Big, { RoundingMode } from 'big.js';

function baseLog(x: number, base: number) {
    return Math.log(x) / Math.log(base) // https://en.wikipedia.org/wiki/Logarithm#Change_of_base
}

/**
 * Converts a number between bases.
 * @param n number to convert as an Uint8Array of the value in each place. e.g. [1, 0, 1] for 5 in binary
 * @param fromBase the base to convert from. e.g. 16 for hexadecimal
 * @param toBase the base to convert to. e.g. 2 for binary
 * @returns n in base toBase as an Uint8Array.
 */
export function convertBase(n: Uint32Array, fromBase: number, toBase: number): Uint32Array {
    let total = new Big(0);

    const bigFromBase = new Big(fromBase);

    for (let i = 0; i < n.length; i++) {
        total = total.add(bigFromBase.pow((n.length - 1) - i).times(n[i])); // convert each place to its total value and and it to the totoal
    }

    if (total.eq(0)) { return new Uint32Array(0); }
    console.log(total.toString());
    console.log(fromBase);
    console.log(toBase);

    const result = [];
    while (total.gte(toBase)) {
        console.log("new round");
        console.log(total.toString());
        result.push(total.mod(toBase)); // store the remainder in result
        total = total.div(toBase).round(0, RoundingMode.RoundDown); // explode as many dots as possible
        console.log(result[result.length - 1].toString());
        console.log(total.toString());
        console.log(total.toString(), new Big(toBase).toString(), total.gt(toBase));
    }

    result.push(total);

    const numResult = result.reverse().map(big => big.toNumber());
    console.log(numResult);

    return new Uint32Array(numResult);
}