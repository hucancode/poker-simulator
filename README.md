# Poker Simulator

## Getting started
The latest build is live at https://poker.lamsaoquenem.day/
### Building locally
I use `Svelte Kit` to build this. You can build and run the application with
```
npm run start
```
Then open this `http://localhost:5173/` in your browser
## Motivation

This tool will help you approximate your winning chance in a [Texas Holdem](https://en.wikipedia.org/wiki/Texas_hold_%27em) poker game.
Kindly set a board, click `Compute`, and let the computer do the hard work for you. 

Without a doubt, luck plays a significant role here, 
but stepping into the game without a good mathematical foundation is equivalent to doing charity.
I hope my codes can do a little help preparing you on that aspect ☺.

## Methodology

### Hand evaluation

I use some bit math to match a hand of cards to a specials pattern. Then rank the hand accordingly.
Check `src/lib/poker/special-hands.js` for pattern building algorithm. 
Check `src/lib/poker/compare.js` for hands comparing/ranking algorithm.

### Combinations

Since the total combinations are so big, traversing every possibility is not realistic (especially when my [programming language](https://www.javascript.com/) is not very fast). I use [Monte Carlo](https://en.wikipedia.org/wiki/Monte_Carlo_algorithm) method to get the approximate result. Here is how many outcomes may happen in any round

|                   | Flop (2 hidden cards)    | Turn (1 hidden card)  | River (All cards visible) |
|-------------------|---------|-------|-------|
| Possible Outcomes | 1070190 | 45540 | 990   |

