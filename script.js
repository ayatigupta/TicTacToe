/**
 * Tic Tac Toe AI - Main Game Script
 * Pure Vanilla JavaScript - No dependencies
 */

// ============================================
// GAME STATE & CONFIGURATION
// ============================================

let gameState = {
  board: Array(9).fill(0), // 0=empty, 1=player, 2=AI
  isPlayerTurn: true,
  gameOver: false,
  winner: null,
  winningCombo: null,
  difficulty: localStorage.getItem('difficulty') || 'hard',
  isDarkMode: localStorage.getItem('theme') === 'dark',
  scores: JSON.parse(localStorage.getItem('scores') || '{"player": 0, "ai": 0, "draw": 0}')
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initializeTheme();

  // Handle page-specific initialization
  const currentPage = document.body.dataset.page || detectPage();
  
  if (currentPage === 'landing') {
    initializeLanding();
  } else if (currentPage === 'game') {
    initializeGame();
  } else if (currentPage === 'scoreboard') {
    initializeScoreboard();
  }
});

// ============================================
// THEME MANAGEMENT
// ============================================

function initializeTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
  });

  if (gameState.isDarkMode) {
    document.body.classList.add('dark-mode');
    updateThemeIcon('moon');
  }
}

function toggleTheme() {
  gameState.isDarkMode = !gameState.isDarkMode;
  if (gameState.isDarkMode) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    updateThemeIcon('moon');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    updateThemeIcon('sun');
  }
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('#themeIcon');
  icons.forEach(icon => {
    icon.textContent = theme === 'moon' ? '🌙' : '☀️';
  });
}

// ============================================
// LANDING PAGE
// ============================================

function initializeLanding() {
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  const descElement = document.getElementById('difficultyDesc');

  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      difficultyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update difficulty
      gameState.difficulty = btn.dataset.difficulty;
      localStorage.setItem('difficulty', gameState.difficulty);

      // Update description
      const descriptions = {
        easy: '🎮 Random moves - Best for learning',
        medium: '🧠 Smart AI - Challenging gameplay',
        hard: '🤖 Unbeatable AI - Expert level'
      };
      descElement.textContent = descriptions[gameState.difficulty];
    });
  });

  // Set initial active button
  const activeBtn = document.querySelector(`.difficulty-btn[data-difficulty="${gameState.difficulty}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// ============================================
// GAME PAGE
// ============================================

function initializeGame() {
  // Load scores
  updateScoreDisplay();

  // Set difficulty badge
  const badge = document.getElementById('difficultyBadge');
  if (badge) {
    badge.textContent = gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1);
  }

  // Initialize board
  initializeBoard();

  // Event listeners
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartGame);
  }

  const playAgainBtn = document.getElementById('playAgainBtn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', restartGame);
  }
}

function initializeBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
    cell.addEventListener('mouseenter', () => cell.classList.add('hover'));
    cell.addEventListener('mouseleave', () => cell.classList.remove('hover'));
  });
  
  renderBoard();
}

function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    cell.innerHTML = '';
    cell.classList.remove('x', 'o', 'winning');

    if (gameState.board[index] === 1) {
      cell.innerHTML = '✕';
      cell.classList.add('x');
    } else if (gameState.board[index] === 2) {
      cell.innerHTML = '◯';
      cell.classList.add('o');
    }

    // Highlight winning combination
    if (gameState.winningCombo && gameState.winningCombo.includes(index)) {
      cell.classList.add('winning');
    }
  });
}

function handleCellClick(event) {
  const cellElement = event.target;
  const index = parseInt(cellElement.dataset.index);

  // Validate move
  if (gameState.board[index] !== 0 || !gameState.isPlayerTurn || gameState.gameOver) {
    return;
  }

  // Player move
  gameState.board[index] = 1;
  playSound('move');
  checkGameState(false);
  renderBoard();

  // AI move (if game not over)
  if (!gameState.gameOver) {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  if (gameState.gameOver) return;

  const aiMove = AI.getAIMove(gameState.board, gameState.difficulty);
  if (aiMove !== null) {
    gameState.board[aiMove] = 2;
    playSound('move');
    checkGameState(true);
    renderBoard();
  }
}

function checkGameState(isAIMove) {
  const winner = AI.checkWinner(gameState.board);

  if (winner) {
    gameState.gameOver = true;
    gameState.winner = winner;
    gameState.winningCombo = AI.getWinningCombo(gameState.board, winner);

    if (winner === 1) {
      gameState.scores.player++;
      showGameOver('won', '🎉 You Won!', 'Congratulations, you beat the AI!');
      playSound('win');
    } else {
      gameState.scores.ai++;
      showGameOver('lost', '🤖 AI Won!', 'The AI has outwitted you!');
      playSound('win');
    }

    saveScores();
    renderBoard();
  } else if (AI.isBoardFull(gameState.board)) {
    gameState.gameOver = true;
    gameState.scores.draw++;
    showGameOver('draw', '🤝 Draw!', "It's a tie! Well played.");
    playSound('win');
    saveScores();
    renderBoard();
  } else {
    gameState.isPlayerTurn = !gameState.isPlayerTurn;
    updateTurnIndicator();
  }
}

function updateTurnIndicator() {
  const indicator = document.getElementById('turnIndicator');
  if (indicator) {
    if (gameState.gameOver) {
      indicator.innerHTML = '<span class="status"></span>';
    } else {
      indicator.textContent = gameState.isPlayerTurn ? '👤 Your Turn' : '🤖 AI Thinking...';
      if (!gameState.isPlayerTurn) {
        indicator.classList.add('pulse');
      } else {
        indicator.classList.remove('pulse');
      }
    }
  }
}

function showGameOver(status, title, message) {
  const modal = document.getElementById('gameOverModal');
  const icon = document.getElementById('modalIcon');
  const titleElement = document.getElementById('modalTitle');
  const messageElement = document.getElementById('modalMessage');

  const icons = { won: '🎉', lost: '🤖', draw: '🤝' };
  icon.textContent = icons[status];
  titleElement.textContent = title;
  messageElement.textContent = message;

  if (modal) {
    modal.style.display = 'flex';
  }
}

function restartGame() {
  // Reset game state
  gameState.board = Array(9).fill(0);
  gameState.isPlayerTurn = true;
  gameState.gameOver = false;
  gameState.winner = null;
  gameState.winningCombo = null;

  // Hide modal and reset board
  const modal = document.getElementById('gameOverModal');
  if (modal) {
    modal.style.display = 'none';
  }

  updateTurnIndicator();
  renderBoard();
}

function updateScoreDisplay() {
  const playerScore = document.getElementById('playerScore');
  const aiScore = document.getElementById('aiScore');
  const drawScore = document.getElementById('drawScore');

  if (playerScore) playerScore.textContent = gameState.scores.player;
  if (aiScore) aiScore.textContent = gameState.scores.ai;
  if (drawScore) drawScore.textContent = gameState.scores.draw;
}

function saveScores() {
  localStorage.setItem('scores', JSON.stringify(gameState.scores));
  updateScoreDisplay();
}

// ============================================
// SCOREBOARD PAGE
// ============================================

function initializeScoreboard() {
  loadScores();
  updateScoreboardDisplay();

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetScores);
  }
}

function loadScores() {
  gameState.scores = JSON.parse(localStorage.getItem('scores') || '{"player": 0, "ai": 0, "draw": 0}');
}

function updateScoreboardDisplay() {
  const total = gameState.scores.player + gameState.scores.ai + gameState.scores.draw;

  // Update stat cards
  document.getElementById('playerWins').textContent = gameState.scores.player;
  document.getElementById('aiWins').textContent = gameState.scores.ai;
  document.getElementById('draws').textContent = gameState.scores.draw;
  document.getElementById('totalGames').textContent = total;

  // Update win rate
  const winRate = total > 0 ? Math.round((gameState.scores.player / total) * 100) : 0;
  document.getElementById('winRate').textContent = winRate + '%';

  // Show/hide appropriate sections
  const emptyState = document.getElementById('emptyState');
  const performanceAnalysis = document.getElementById('performanceAnalysis');
  const scoreboardActions = document.getElementById('scoreboardActions');

  if (total === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (performanceAnalysis) performanceAnalysis.style.display = 'none';
    if (scoreboardActions) scoreboardActions.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    if (performanceAnalysis) performanceAnalysis.style.display = 'block';
    if (scoreboardActions) scoreboardActions.style.display = 'flex';

    // Update charts
    updateCharts(total);
  }
}

function updateCharts(total) {
  const playerPercent = Math.round((gameState.scores.player / total) * 100);
  const drawPercent = Math.round((gameState.scores.draw / total) * 100);
  const aiPercent = Math.round((gameState.scores.ai / total) * 100);

  // Update bar widths and labels
  const playerBar = document.getElementById('playerBar');
  const drawBar = document.getElementById('drawBar');
  const aiBar = document.getElementById('aiBar');

  if (playerBar) {
    playerBar.style.width = playerPercent + '%';
    document.getElementById('playerPercent').textContent = playerPercent > 0 ? playerPercent + '%' : '';
  }
  if (drawBar) {
    drawBar.style.width = drawPercent + '%';
    document.getElementById('drawPercent').textContent = drawPercent > 0 ? drawPercent + '%' : '';
  }
  if (aiBar) {
    aiBar.style.width = aiPercent + '%';
    document.getElementById('aiPercent').textContent = aiPercent > 0 ? aiPercent + '%' : '';
  }
}

function resetScores() {
  if (confirm('Are you sure you want to reset all scores?')) {
    gameState.scores = { player: 0, ai: 0, draw: 0 };
    localStorage.setItem('scores', JSON.stringify(gameState.scores));
    updateScoreboardDisplay();
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function playSound(type) {
  // Sound support - audio files should be in the root or public folder
  // Optional: Add sound files move.mp3 and win.mp3
  try {
    const sounds = {
      move: 'move.mp3',
      win: 'win.mp3'
    };
    if (sounds[type]) {
      // Uncomment if audio files are available
      // new Audio(sounds[type]).play().catch(e => console.log('Sound not available'));
    }
  } catch (e) {
    // Sound not available - that's okay
  }
}

function detectPage() {
  const path = window.location.pathname;
  if (path.includes('game.html')) return 'game';
  if (path.includes('scoreboard.html')) return 'scoreboard';
  return 'landing';
}
