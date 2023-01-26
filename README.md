# Poker Simulator

## Motivation

This tool will help you approximate your winning chance in a "Texas Holdem" poker game.
Kindly set a board, click `Compute` and let the computer do the hard work for you. 

Without a doubt, luck play a significant role in the game, 
but step into the game without a good mathematical foundation can harm you in the long run.
I hope my codes can do a little help preparing you on that aspect ☺.

## Methodology

### Hand evaluation

I use some bit math to match a hand of cards to a specials pattern. Then rank the hand accordingly.
Check `src/lib/poker/special-hands.js` for pattern building algorithm. 
Check `src/lib/poker/compare.js` for hands comparing/ranking algorithm.

### Combinations

Since the total combinations is so big we probably can't traverse all possible situations. I use [Monte Carlo](https://en.wikipedia.org/wiki/Monte_Carlo_algorithm) to get the approximate result. Here is how many outcomes that may happen in any round

|                   | Flop (2 hidden cards)    | Turn (1 hidden card)  | River (All cards visible) |
|-------------------|---------|-------|-------|
| Possible Outcomes | 1070190 | 45540 | 990   |

## Running
The latest build is live at https://poker.lamsaoquenem.day/
### Building locally
I use `Svelte Kit` to build this. You can build and run the application with
```
npm run start
```
Then open this `http://localhost:5173/` in your browser
