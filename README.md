# Poker Simulator

## Getting started
This tool will help you approximate your winning chance in a [Texas Holdem](https://en.wikipedia.org/wiki/Texas_hold_%27em) poker game.
Kindly set a board, click `Compute`, and let the computer do the hard work for you.
The latest build is live at [here](https://poker.lamsaoquenem.day/)

### Building locally

I use `Svelte Kit` to build this. You can build and run the application with

```
npm run dev
```

Then open this `http://localhost:5173/` in your browser

## Backend

Heavy computation is done in `rust` and compile back to `wasm`.
Detail on the implementation will be explained [here](https://github.com/hucancode/poker-solver)
