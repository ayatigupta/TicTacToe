# Tic Tac Toe AI

A pure vanilla JavaScript Tic Tac Toe game with an intelligent AI opponent using the Minimax algorithm.

## 🚀 Quick Start

**Just double-click `index.html` to play!**

No installation, no npm, no build tools needed. Runs directly in your browser.

## 📁 Project Files

| File | Purpose |
|------|---------|
| **index.html** | Landing page - select difficulty and start game |
| **game.html** | Main game board (3x3 grid) with score tracking |
| **scoreboard.html** | View statistics and performance |
| **script.js** | Game logic, state management, event handlers |
| **ai.js** | Minimax algorithm with three difficulty levels |
| **style.css** | Complete styling with animations and themes |

## 🎮 How to Play

1. Open `index.html` in your browser
2. Choose difficulty: **Easy** (random), **Medium** (depth 3), or **Hard** (full search)
3. Click cells to play as X
4. AI plays as O
5. First to get 3 in a row wins
6. Scores persist automatically

## ✨ Features

- **AI Difficulties**: Easy, Medium, Hard (Minimax with alpha-beta pruning)
- **Dark/Light Theme**: Toggle with button in header
- **Score Tracking**: Automatic localStorage persistence
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Beautiful UI**: Glassmorphic design with pastel colors and animations

## 🧠 The AI Algorithm (ai.js)

The Minimax algorithm explores all possible game states and chooses the optimal move:
- **Easy**: Random move selection
- **Medium**: Minimax depth 3 (balanced speed/strength)
- **Hard**: Full minimax exploration (unbeatable)

## 📊 Pure Vanilla JavaScript

- ✅ No React, Vue, or frameworks
- ✅ No npm or build tools
- ✅ No external CDN libraries
- ✅ Only HTML5, CSS3, and JavaScript
- ✅ Works in any modern browser
