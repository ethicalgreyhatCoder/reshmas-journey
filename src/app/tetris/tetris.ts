import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Define Tetromino shapes and colors
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#0ea5e9' }, // Cyan
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' }, // Blue
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f59e0b' }, // Orange
  O: { shape: [[1, 1], [1, 1]], color: '#eab308' }, // Yellow
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#10b981' }, // Green
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#8b5cf6' }, // Purple
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' }  // Red
};
type TetrominoKey = keyof typeof TETROMINOS;

@Component({
  selector: 'app-tetris',
  imports: [],
  templateUrl: './tetris.html',
  styleUrl: './tetris.css',
})
export class Tetris implements OnInit, OnDestroy {
  COLS = 10;
  ROWS = 20;

  board: (string | null)[][] = [];
  
  isGameRunning = false;
  gameOver = false;
  
  score = 0;
  level = 1;
  linesCleared = 0;
  
  // Current piece
  currentPiece: { shape: number[][], color: string } | null = null;
  currentX = 0;
  currentY = 0;

  gameLoopId: any;
  dropInterval = 1000;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initBoard();
  }

  ngOnDestroy() {
    this.stopGame();
  }

  goBack() {
    this.stopGame();
    this.router.navigate(['/dashboard']);
  }

  initBoard() {
    this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(null));
  }

  startGame() {
    this.initBoard();
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.dropInterval = 1000;
    this.gameOver = false;
    this.isGameRunning = true;
    this.spawnPiece();
    
    if (this.gameLoopId) clearInterval(this.gameLoopId);
    this.gameLoopId = setInterval(() => this.gameLoop(), this.dropInterval);
  }

  stopGame() {
    this.isGameRunning = false;
    if (this.gameLoopId) clearInterval(this.gameLoopId);
  }

  spawnPiece() {
    const keys = Object.keys(TETROMINOS) as TetrominoKey[];
    const randKey = keys[Math.floor(Math.random() * keys.length)];
    const template = TETROMINOS[randKey];
    
    this.currentPiece = {
      shape: template.shape,
      color: template.color
    };
    // Center it
    this.currentX = Math.floor(this.COLS / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
    this.currentY = 0;

    // Check game over
    if (!this.isValidMove(this.currentPiece.shape, this.currentX, this.currentY)) {
      this.gameOver = true;
      this.stopGame();
    } else {
      this.drawPiece();
    }
  }

  gameLoop() {
    if (!this.isGameRunning || this.gameOver) return;
    this.moveDown();
  }

  drawPiece() {
    if (!this.currentPiece) return;
    // Add current piece to board for rendering
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          const targetY = this.currentY + y;
          const targetX = this.currentX + x;
          if (targetY >= 0 && targetY < this.ROWS && targetX >= 0 && targetX < this.COLS) {
            this.board[targetY][targetX] = this.currentPiece.color;
          }
        }
      }
    }
  }

  clearPiece() {
    if (!this.currentPiece) return;
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          const targetY = this.currentY + y;
          const targetX = this.currentX + x;
          if (targetY >= 0 && targetY < this.ROWS && targetX >= 0 && targetX < this.COLS) {
            this.board[targetY][targetX] = null;
          }
        }
      }
    }
  }

  isValidMove(shape: number[][], nextX: number, nextY: number): boolean {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const targetX = nextX + x;
          const targetY = nextY + y;
          // Out of bounds
          if (targetX < 0 || targetX >= this.COLS || targetY >= this.ROWS) {
            return false;
          }
          // Collision with piece on board (ignore negative Y, and ignore cells currently part of the piece itself? No, we clear it first)
          if (targetY >= 0 && this.board[targetY][targetX] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }

  moveDown() {
    if (this.gameOver || !this.isGameRunning) return;
    this.clearPiece();
    if (this.currentPiece && this.isValidMove(this.currentPiece.shape, this.currentX, this.currentY + 1)) {
      this.currentY++;
      this.drawPiece();
    } else {
      // Solidify and spawn next
      this.drawPiece(); // Lock in place
      this.checkLines();
      this.spawnPiece();
    }
  }

  moveLeft() {
    this.clearPiece();
    if (this.currentPiece && this.isValidMove(this.currentPiece.shape, this.currentX - 1, this.currentY)) {
      this.currentX--;
    }
    this.drawPiece();
  }

  moveRight() {
    this.clearPiece();
    if (this.currentPiece && this.isValidMove(this.currentPiece.shape, this.currentX + 1, this.currentY)) {
      this.currentX++;
    }
    this.drawPiece();
  }

  rotate() {
    if (!this.currentPiece) return;
    this.clearPiece();
    // Rotate 90 degrees
    const shape = this.currentPiece.shape;
    const newShape = shape[0].map((val, index) => shape.map(row => row[index]).reverse());
    
    // Wall kick simple logic (if invalid, push away from right or left wall)
    let tempX = this.currentX;
    if (!this.isValidMove(newShape, tempX, this.currentY)) {
      // Try shifting left or right once
      if (this.isValidMove(newShape, tempX - 1, this.currentY)) tempX -= 1;
      else if (this.isValidMove(newShape, tempX + 1, this.currentY)) tempX += 1;
    }

    if (this.isValidMove(newShape, tempX, this.currentY)) {
      this.currentPiece.shape = newShape;
      this.currentX = tempX;
    }
    this.drawPiece();
  }

  hardDrop() {
    if (this.gameOver || !this.isGameRunning || !this.currentPiece) return;
    this.clearPiece();
    let newY = this.currentY;
    while (this.isValidMove(this.currentPiece.shape, this.currentX, newY + 1)) {
      newY++;
    }
    this.currentY = newY;
    this.drawPiece();
    this.checkLines();
    this.spawnPiece();
  }

  checkLines() {
    let linesClearedThisTurn = 0;
    
    for (let y = this.ROWS - 1; y >= 0; y--) {
      // Is row full?
      let isFull = true;
      for (let x = 0; x < this.COLS; x++) {
        if (this.board[y][x] === null) {
          isFull = false;
          break;
        }
      }
      
      if (isFull) {
        // Remove row and add empty row at top
        this.board.splice(y, 1);
        this.board.unshift(Array(this.COLS).fill(null));
        linesClearedThisTurn++;
        y++; // Re-check current index since they shifted down
      }
    }
    
    if (linesClearedThisTurn > 0) {
      this.linesCleared += linesClearedThisTurn;
      // standard scoring: 100 * lines^2
      this.score += 100 * Math.pow(linesClearedThisTurn, 2) * this.level;
      
      // Level up every 5 lines
      if (Math.floor(this.linesCleared / 5) + 1 > this.level) {
        this.level++;
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        clearInterval(this.gameLoopId);
        this.gameLoopId = setInterval(() => this.gameLoop(), this.dropInterval);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isGameRunning || this.gameOver) return;

    // Prevent default scrolling for arrows and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }

    switch(event.key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowUp':
        this.rotate();
        break;
      case ' ': // Spacebar
        this.hardDrop();
        break;
    }
  }
}
