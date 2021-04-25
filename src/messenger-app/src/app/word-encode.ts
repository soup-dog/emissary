import { convertBase } from './base-converter';

const indexToWord: string[] = require('!!raw-loader?!../assets/words.txt').default.split('\n'); // get words list
const numWords: number = indexToWord.length;
const wordToIndex: any = {};
for (let i = 0; i < numWords; i++) {
    wordToIndex[indexToWord[i]] = i;
}

export function encodeToWords(array: Uint32Array): string[] {
    return Array.from(convertBase(array, 4294967296, numWords)).map(index => indexToWord[index]);
}

export function decodeFromWords(words: string[]): Uint32Array {
    return convertBase(new Uint32Array(words.map(word => wordToIndex[word])), numWords, 4294967296);
}