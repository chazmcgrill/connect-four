import { Board, BoardItem, GameState, Player, Token } from './types';

export const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const WIN_LENGTH = 4;

export const getNewBoard = (): BoardItem[][] =>
    Array(BOARD_WIDTH)
        .fill(null)
        .map(() => Array(BOARD_HEIGHT).fill(null));

export const getColumnItems = (columnFirstIndex: number, board: BoardItem[]) => {
    const columnItems = [];
    for (let i = columnFirstIndex; i < BOARD_WIDTH * BOARD_HEIGHT; i += BOARD_WIDTH) {
        const columnItem = board[i];
        columnItems.push(columnItem);
    }
    return columnItems;
};

export const drawCheck = (board: Board) => {
    return board.flat().filter((item) => item === null).length === 0;
};

const DIRECTIONS = [
    { x: 0, y: 1 }, // North-South
    { x: 1, y: 0 }, // East-West
    { x: 1, y: 1 }, // Northeast-Southwest
    { x: 1, y: -1 }, // Southeast-Northwest
];

export const winCheck = (board: Board, placedX: number, placedY: number) => {
    console.log('winCheck', { placedX, placedY });
    if (placedX < 0 || placedY < 0) return false;
    let i,
        j,
        x,
        y,
        maxX,
        maxY,
        steps,
        count = 0;

    // Check all directions
    outerloop: for (i = 0; i < DIRECTIONS.length; i++, count = 0) {
        // Set up bounds to go 3 pieces forward and backward
        x = Math.min(Math.max(placedX - 3 * DIRECTIONS[i].x, 0), board.length - 1);
        y = Math.min(Math.max(placedY - 3 * DIRECTIONS[i].y, 0), board[0].length - 1);
        maxX = Math.max(Math.min(placedX + 3 * DIRECTIONS[i].x, board.length - 1), 0);
        maxY = Math.max(Math.min(placedY + 3 * DIRECTIONS[i].y, board[0].length - 1), 0);
        steps = Math.max(Math.abs(maxX - x), Math.abs(maxY - y));

        console.log('board', { x, y });

        for (j = 0; j < steps; j++, x += DIRECTIONS[i].x, y += DIRECTIONS[i].y) {
            if (board[x]?.[y] === board[placedX][placedY]) {
                // Increase count
                if (++count >= WIN_LENGTH) {
                    break outerloop;
                }
            } else {
                // Reset count
                count = 0;
            }
        }
    }

    return count >= WIN_LENGTH;
};

/** Gets the new game status at the end of a turn */
export const getNewGameStatus = (board: Board, currentPlayer: Player, columnIndex: number, rowIndex: number) => {
    if (winCheck(board, columnIndex, rowIndex)) return currentPlayer === Player.Human ? GameState.WIN : GameState.LOSE;
    if (drawCheck(board)) return GameState.DRAW;
    return currentPlayer === Player.Human ? GameState.AI_TURN : GameState.HUMAN_TURN;
};

export const getNextColumnItem = (board: Board, columnIndex: number) => {
    const rowIndex = board[columnIndex].findIndex((item) => item === null);
    return rowIndex > -1 ? rowIndex : null;
};

export const getAvailableMoves = (board: Board) => {
    const availableMoves: { rowIndex: number; columnIndex: number }[] = [];
    board.forEach((_, columnIndex) => {
        const rowIndex = getNextColumnItem(board, columnIndex);
        if (rowIndex !== null) availableMoves.push({ rowIndex, columnIndex });
    });
    return availableMoves;
};

interface GetNextGameDataOptions {
    currentBoard: Board;
    placedRowIndex: number;
    placedColumnIndex: number;
    player: Player;
    currentToken: Token;
}

export const getNextGameData = ({
    currentBoard,
    placedRowIndex,
    placedColumnIndex,
    player,
    currentToken,
}: GetNextGameDataOptions) => {
    const newBoard = currentBoard.map((column, columnIndex) =>
        column.map((item, rowIndex) =>
            columnIndex === placedColumnIndex && rowIndex === placedRowIndex ? currentToken : item,
        ),
    );
    return {
        board: newBoard,
        gameStatus: getNewGameStatus(newBoard, player, placedColumnIndex, placedRowIndex),
    };
};
