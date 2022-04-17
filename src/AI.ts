import { Board, Token } from './types';
import { getAvailableMoves, drawCheck, winCheck } from './utils';

interface MoveObject {
    columnIndex: number;
    rowIndex: number;
    score: any;
}

/** Maximum recursion depth, if performance is improved this could go higher */
const MAX_DEPTH = 5;

export class AI {
    private board;
    private aiToken;
    private humanToken;
    private alpha = -Infinity;
    private beta = Infinity;

    /**
     * AI class which uses the minimax algorithm to determine the best move for the AI player
     * @param board the current board state
     * @param aiToken the token for the AI player
     */
    constructor(board: Board, aiToken: Token) {
        this.board = board.slice();
        this.aiToken = aiToken;
        this.humanToken = aiToken === Token.Red ? Token.Yellow : Token.Red;
    }

    /** Gets the index of the best available move for the AI player */
    getMoveIndex() {
        const { board, aiToken } = this;
        const { columnIndex, rowIndex } = this.minimax(board, aiToken, 0, -1, -1);
        return { columnIndex, rowIndex };
    }

    private setToken(token: Token, columnIndex: number, rowIndex: number) {
        this.board[columnIndex][rowIndex] = token;
    }

    private resetToken(columnIndex: number, rowIndex: number) {
        this.board[columnIndex][rowIndex] = null;
    }

    /* Minimax algorithm function for unbeatable ai */
    private minimax(tempBoard: Board, turn: Token, depth: number, columnIndex: number, rowIndex: number): MoveObject {
        const availableMoves = getAvailableMoves(tempBoard);
        console.log('availableMoves', availableMoves);
        // const availableMoveIndexes = availableMoves.map((item) => item.index);
        const nullIndex = -1;
        const isWin = winCheck(tempBoard, columnIndex, rowIndex);

        /* Check for terminal states, return score based on recursion depth and player end state.
           - If human wins we want a lower value the nearest it is to the root node.
           - If AI wins we want a higher value the nearest it is to the root node.
           - For draw no one wins so we return 0.       
        */
        if (isWin && turn === this.aiToken) {
            return { columnIndex, rowIndex, score: depth - 10 };
        } else if (isWin && turn === this.humanToken) {
            return { columnIndex, rowIndex, score: 10 - depth };
        } else if (drawCheck(tempBoard)) {
            return { columnIndex, rowIndex, score: 0 };
        }

        if (depth > MAX_DEPTH) return { columnIndex: nullIndex, rowIndex: nullIndex, score: 0 };

        if (turn === this.aiToken) {
            let bestMove = { columnIndex: nullIndex, rowIndex: nullIndex, score: -Infinity };
            // recursivly find the best move for the ai player
            availableMoves.forEach(({ rowIndex, columnIndex }) => {
                this.setToken(this.aiToken, columnIndex, rowIndex);
                const { score } = this.minimax(tempBoard, this.humanToken, depth + 1, columnIndex, rowIndex);
                if (score > bestMove.score) bestMove = { columnIndex, rowIndex, score };
                this.resetToken(columnIndex, rowIndex);

                // alpha-beta pruning
                this.alpha = Math.max(this.alpha, bestMove.score);
                if (this.beta <= this.alpha) return;
            });
            return bestMove;
        } else {
            let bestMove = { columnIndex: nullIndex, rowIndex: nullIndex, score: Infinity };
            // recursivly find the best move for the human player
            availableMoves.forEach(({ rowIndex, columnIndex }) => {
                this.setToken(this.humanToken, columnIndex, rowIndex);
                const { score } = this.minimax(tempBoard, this.aiToken, depth + 1, rowIndex, columnIndex);
                if (score < bestMove.score) bestMove = { columnIndex, rowIndex, score };
                this.resetToken(columnIndex, rowIndex);

                // alpha-beta pruning
                this.beta = Math.min(this.beta, bestMove.score);
                if (this.beta <= this.alpha) return;
            });
            return bestMove;
        }
    }
}
