import { expect, test } from 'vitest'
import { handTextToArray, handMaskToText, handTextToMask } from "./cards.js";
import { A_WIN, B_WIN, TIE, 
  STRAIGHT_FLUSH, 
  FOUR_OF_A_KIND, 
  FULL_HOUSE, 
  FLUSH, 
  STRAIGHT, 
  THREE_OF_A_KIND,
  TWO_PAIR,
  PAIR,
  HIGH_CARD,
  compare7, getStrongest5 } from './compare.js';

function compute7(a, b) {
  const arrA = handTextToArray(a);
  const arrB = handTextToArray(b);
  const ret = compare7(arrA, arrB);
  return ret;
}
function strongest(a) {
  const arrA = handTextToArray(a);
  const ret = getStrongest5(arrA);
  return ret;
}

test('AAAAQ vs AAAAK',() => {
  const ret = compute7("AsAcAdAhQh3s4s", "AsAcAdAhQhKh3d");
  expect(ret).toBe(B_WIN);
});

test('best hand 12345 out of 7 cards',() => {
  const output = strongest("As2c3s4s5dKcQd");
  const best5Mask = handTextToMask("As2c3s4s5d");
  const order = 9; // this is the lowest value STRAIGHT out of 10 STRAIGHT combinations
  const expected = {
    mask: best5Mask,
    order: order,
    rank: STRAIGHT,
    unranked: 0n
  };
  expect(output).toStrictEqual(expected);
});

test('best hand 49TKA (high card) out of 7 cards',() => {
  const output = strongest("As2c3s4d9sTdKc");
  const best5Mask = handTextToMask("As4d9sTdKc");
  const expected = {
    mask: 0n,
    order: 0,
    rank: HIGH_CARD,
    unranked: best5Mask,
  };
  expect(output).toStrictEqual(expected);
});
