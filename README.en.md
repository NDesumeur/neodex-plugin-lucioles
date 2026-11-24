# Lucioles (Fireflies)

A lights puzzle in a meadow at night: touching a firefly turns it on or off, along with its four neighbours. Light them all, in as few moves as possible.

*Version française : [README.md](README.md)*

## Daily meadow and the solution explained (new in 1.2.0)

**Daily meadow**: one meadow, the same for everyone each day, with a day streak. **The solution explained**: the game is an algebra problem. Touching a firefly twice changes nothing, so all that counts is “touched or not” (0 or 1, with 1 + 1 = 0); each firefly gives one equation, and the game solves these 25 equations by elimination. It explains the calculation (how many truly different equations, how many solutions) and marks the cells of the shortest solution on the meadow.

## How to play

- The meadow is a 5 × 5 grid of fireflies, some lit, some dark.
- **Click a firefly**: it flips (lit ↔ dark), along with those directly **above, below, left and right**. On the edges and in the corners there are fewer neighbours.
- The meadow is done when **every firefly is lit**.

Tip: the order of the touches does not matter, and touching the same firefly twice is the same as doing nothing.

- **Full screen**: the button of the same name; Escape to leave it. Otherwise the meadow takes all the room the window leaves.
- An unlit firefly rests on its stem, wings folded; lit, it **takes off**, beats its wings and flutters about in small loops, its abdomen glowing.

## The meadows

- Each meadow is made by starting from a fully lit meadow and touching a few fireflies: so it is **always solvable**, and the game knows how many moves it took.
- Meadow 1 takes 3 moves; each following meadow needs one more, up to 12.
- A solved meadow opens the next one; **◀ ▶** go back to meadows already reached.

## Stars

At the top, the counter shows your moves and the game's. **Three stars** if you finish in as many moves as the game or fewer, two for up to 3 more moves, one beyond that.

## Statistics

The Records panel shows the **furthest meadow** reached, the total **stars** and the number of **meadows finished**.

## Data and sync

Your progress and stars are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Lucioles → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
