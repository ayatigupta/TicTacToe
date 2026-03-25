/**
 * Tic Tac Toe AI - Minimax Algorithm Implementation
 * Pure JavaScript - No dependencies required
 */

const AI = {
  // Winning combinations on the board (indices 0-8)
  WINNING_COMBOS: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],

  /**
   * Check if there's a winner on the board
   * @param {Array} board - Current board state (9 elements: 0 = empty, 1 = player, 2 = AI)
   * @returns {number|null} - 1 if player wins, 2 if AI wins, null if no winner
   */
  checkWinner(board) {
    for (const combo of this.WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  },

  /**
   * Check if the board is full
   * @param {Array} board - Current board state
   * @returns {boolean} - True if board is full
   */
  isBoardFull(board) {
    return board.every(cell => cell !== 0);
  },

  /**
   * Get all available moves (empty cells)
   * @param {Array} board - Current board state
   * @returns {Array} - Array of available cell indices
   */
  getAvailableMoves(board) {
    return board
      .map((cell, index) => (cell === 0 ? index : null))
      .filter(index => index !== null);
  },

  /**
   * Minimax Algorithm with Alpha-Beta Pruning
   * Recursively evaluates all possible game states
   * 
   * @param {Array} board - Current board state
   * @param {number} depth - Current recursion depth
   * @param {boolean} isMaximizing - True if AI's turn, false if player's turn
   * @param {number} maxDepth - Maximum depth to search (for medium difficulty)
   * @param {number} alpha - Alpha value for pruning
   * @param {number} beta - Beta value for pruning
   * @returns {number} - Score of the position (-10 to +10)
   */
  minimax(board, depth, isMaximizing, maxDepth = Infinity, alpha = -Infinity, beta = Infinity) {
    const winner = this.checkWinner(board);

    // Terminal conditions
    if (winner === 2) return 10 - depth; // AI wins (prefer faster wins)
    if (winner === 1) return depth - 10; // Player wins (prefer slower losses)
    if (this.isBoardFull(board)) return 0; // Draw

    // Depth-limited search for medium difficulty
    if (depth >= maxDepth) return 0;

    const availableMoves = this.getAvailableMoves(board);

    if (isMaximizing) {
      // AI's turn - maximize score
      let bestScore = -Infinity;

      for (const move of availableMoves) {
        board[move] = 2; // AI's move
        const score = this.minimax(board, depth + 1, false, maxDepth, alpha, beta);
        board[move] = 0; // Undo move
        bestScore = Math.max(score, bestScore);

        // Alpha-beta pruning
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }

      return bestScore;
    } else {
      // Player's turn - minimize score
      let bestScore = Infinity;

      for (const move of availableMoves) {
        board[move] = 1; // Player's move
        const score = this.minimax(board, depth + 1, true, maxDepth, alpha, beta);
        board[move] = 0; // Undo move
        bestScore = Math.min(score, bestScore);

        // Alpha-beta pruning
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }

      return bestScore;
    }
  },

  /**
   * Get the best move for AI using minimax algorithm
   * @param {Array} board - Current board state
   * @param {string} difficulty - 'easy', 'medium', or 'hard'
   * @returns {number} - Index of the best move
   */
  getAIMove(board, difficulty = 'hard') {
    const availableMoves = this.getAvailableMoves(board);

    if (availableMoves.length === 0) return null;

    // Easy: Random move
    if (difficulty === 'easy') {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Medium: Depth-limited minimax (depth 3)
    // Hard: Full minimax
    const maxDepth = difficulty === 'medium' ? 3 : Infinity;

    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of availableMoves) {
      const boardCopy = [...board];
      boardCopy[move] = 2; // Try AI move
      const score = this.minimax(boardCopy, 0, false, maxDepth);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  },

  /**
   * Check if a specific combination is a winner
   * @param {Array} board - Current board state
   * @param {number} player - 1 for player, 2 for AI
   * @returns {Array|null} - Winning combo indices or null
   */
  getWinningCombo(board, player) {
    for (const combo of this.WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return combo;
      }
    }
    return null;
  }
};
