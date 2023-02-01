import { expect, test } from "vitest";
import { handTextToArray, handMaskToText, handTextToMask } from "./cards.js";
import { enumerate, solve } from "./solver.js";

function compute(a, b, c) {
  const arrA = handTextToArray(a);
  const arrB = handTextToArray(b);
  const arrC = handTextToArray(c);
  const used = arrA.concat(arrB).concat(arrC);
  const ret = solve(
    enumerate(used, arrA, 2),
    enumerate(used, arrB, 2),
    enumerate(used, arrC, 5)
  );
  // console.log("testing", a, b, c, ret);
  return ret;
}

test("tie game, AAAAQ on board", () => {
  const ret = compute("3s4s", "5s6s", "AsAcAdAhQh");
  expect(ret.tie).toBe(1);
});
test("lose game, AAAAQ on board, opp has K", () => {
  const ret = compute("3s4s", "Ks6s", "AsAcAdAhQh");
  expect(ret.lose).toBe(1);
});
test("lose game to a straight", () => {
  const ret = compute("7c4d", "4c3d", "6s2d7d9s5s");
  expect(ret.lose).toBe(1);
});
test("win game, high card", () => {
  const ret = compute("Ac4d", "Tc3d", "6s2d7d9s5s");
  expect(ret.win).toBe(1);
});
