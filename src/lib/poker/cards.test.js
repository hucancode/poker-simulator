import { expect, test } from "vitest";
import {
  handArrayToMask,
  handArrayToText,
  handMaskToArray,
  handTextToMask,
  handTextToArray,
} from "./cards.js";

test("AAAAQ to int array", () => {
  const input = "AsAcAdAhQh";
  const output = handTextToArray(input);
  const expected = [48, 49, 50, 51, 43];
  expect(output.sort()).toEqual(expected.sort());
});

test("QQQKK to int array", () => {
  const input = "QsQcQhKsKc";
  const output = handTextToArray(input);
  const expected = [40, 41, 43, 44, 45];
  expect(output.sort()).toEqual(expected.sort());
});

test("array QQQKK to text", () => {
  const input = [40, 41, 43, 44, 45];
  const output = handArrayToText(input.sort());
  const expected = "QsQcQhKsKc";
  expect(output).toEqual(expected);
});

test("array QQQKK to mask", () => {
  const input = [40, 41, 43, 44, 45];
  const output = handArrayToMask(input);
  const expected = 64871186038784n;
  expect(output).toEqual(expected);
});

test("mask QQQKK to array", () => {
  const input = 64871186038784n;
  const output = handMaskToArray(input);
  const expected = [40, 41, 43, 44, 45];
  expect(output.sort()).toEqual(expected.sort());
});
