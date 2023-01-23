import { handTextToArray } from "./cards.js";
import { solve5, solve6, solve7, solve9 } from "./solver.js";

const hand = "KsAs";
const community = "2d9h2h";
const ret = solve5(handTextToArray(hand), handTextToArray(community));
console.log(ret);
