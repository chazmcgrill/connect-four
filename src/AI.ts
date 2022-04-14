import { Board, Token } from './types';
import { getAvailableMoves, drawCheck, winCheck } from './utils';

interface MoveObject {
    index: number;
    score: any;
}

/** Maximum recursion depth, if performance is improved this could go higher */
const MAX_DEPTH = 6;

export class AI {
    private board;
    private aiToken;
    private humanToken;

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
        const { index } = this.minimax(board, aiToken, 0);
        return index;
    }

    /* Minimax algorithm function for unbeatable ai */
    private minimax(tempBoard: Board, turn: Token, depth: number): MoveObject {
        const availableMoves = getAvailableMoves(tempBoard);
        const availableMoveIndexes = availableMoves.map((item) => item.index);
        const startingIndex = -1;

        /* Check for terminal states, return score based on recursion depth and player end state.
           - If human wins we want a lower value the nearest it is to the root node.
           - If AI wins we want a higher value the nearest it is to the root node.
           - For draw no one wins so we return 0.       
        */
        if (winCheck(tempBoard, this.humanToken)) {
            return { index: startingIndex, score: depth - 10 };
        } else if (winCheck(tempBoard, this.aiToken)) {
            return { index: startingIndex, score: 10 - depth };
        } else if (drawCheck(tempBoard)) {
            return { index: startingIndex, score: 0 };
        }

        if (depth > MAX_DEPTH) return { index: startingIndex, score: 0 };

        if (turn === this.aiToken) {
            let bestMove = { index: 0, score: -Infinity };
            availableMoveIndexes.forEach((availableSquareIndex) => {
                tempBoard[availableSquareIndex] = { ...tempBoard[availableSquareIndex], currentToken: turn };
                const { score } = this.minimax(tempBoard, this.humanToken, depth + 1);
                if (score > bestMove.score) bestMove = { index: availableSquareIndex, score };
                tempBoard[availableSquareIndex] = { ...tempBoard[availableSquareIndex], currentToken: null };
            });
            return bestMove;
        } else {
            let bestMove = { index: 0, score: +Infinity };
            availableMoveIndexes.forEach((availableSquareIndex) => {
                tempBoard[availableSquareIndex] = { ...tempBoard[availableSquareIndex], currentToken: turn };
                const { score } = this.minimax(tempBoard, this.aiToken, depth + 1);
                if (score < bestMove.score) bestMove = { index: availableSquareIndex, score };
                tempBoard[availableSquareIndex] = { ...tempBoard[availableSquareIndex], currentToken: null };
            });
            return bestMove;
        }
    }
}
