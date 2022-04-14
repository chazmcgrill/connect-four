import { Board, BoardItem, GameState, Player, Token } from './types';

export const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const WIN_LENGTH = 4;

export const getNewBoard = (): BoardItem[] =>
    Array(BOARD_WIDTH * BOARD_HEIGHT)
        .fill(null)
        .map((_, index) => ({ index, currentToken: null }));

export const findColumnFirstIndex = (columnIndex: number): number => {
    if (columnIndex < BOARD_WIDTH) return columnIndex;
    return findColumnFirstIndex(columnIndex - BOARD_WIDTH);
};

export const getColumnItems = (columnFirstIndex: number, board: BoardItem[]) => {
    const columnItems = [];
    for (let i = columnFirstIndex; i < BOARD_WIDTH * BOARD_HEIGHT; i += BOARD_WIDTH) {
        const columnItem = board[i];
        columnItems.push(columnItem);
    }
    return columnItems;
};

export const drawCheck = (board: BoardItem[]) => {
    return board.filter((item) => item.currentToken === null).length === 0;
};

const checkRowWin = (board: BoardItem[], currentToken: Token) => {
    for (let i = 0; i < BOARD_HEIGHT; i++) {
        let count = 0;
        for (let j = 0; j < BOARD_WIDTH; j++) {
            const item = board[i * BOARD_WIDTH + j];
            count = item.currentToken === currentToken ? count + 1 : 0;
            if (count === WIN_LENGTH) return true;
        }
    }
    return false;
};

const checkColumnWin = (board: BoardItem[], currentToken: Token) => {
    for (let i = 0; i < BOARD_WIDTH; i++) {
        let hasWin = false;
        let count = 0;
        const columnFirstIndex = findColumnFirstIndex(i);
        const columnItems = getColumnItems(columnFirstIndex, board);
        columnItems.forEach((item) => {
            count = item.currentToken === currentToken ? count + 1 : 0;
            if (count === WIN_LENGTH) {
                hasWin = true;
                return;
            }
        });
        if (hasWin) return true;
    }
    return false;
};

const DIAGONAL_LANE_INDEXES = [
    [3, 9, 15, 21],
    [4, 10, 16, 22, 28],
    [5, 11, 17, 23, 29, 35],
    [6, 12, 18, 24, 30, 36],
    [13, 19, 25, 31, 37],
    [20, 26, 32, 38],
    [3, 11, 19, 27],
    [2, 10, 18, 26, 34],
    [1, 9, 17, 25, 33, 41],
    [0, 8, 16, 24, 32, 40],
    [7, 15, 23, 31, 39],
    [14, 22, 30, 38],
];

const checkDiagonalWin = (board: BoardItem[], currentToken: Token) => {
    let hasWin = false;
    DIAGONAL_LANE_INDEXES.forEach((diagonalLane) => {
        let count = 0;
        diagonalLane.forEach((index) => {
            const item = board[index];
            count = item.currentToken === currentToken ? count + 1 : 0;
            if (count === WIN_LENGTH) {
                hasWin = true;
                return;
            }
        });
    });
    if (hasWin) return true;
    return false;
};

export const winCheck = (board: BoardItem[], currentToken: Token) => {
    const rowWin = checkRowWin(board, currentToken);
    if (rowWin) return true;

    const columnWin = checkColumnWin(board, currentToken);
    if (columnWin) return true;

    const diagonalWin = checkDiagonalWin(board, currentToken);
    if (diagonalWin) return true;

    return false;
};

/** Gets the new game status at the end of a turn */
export const getNewGameStatus = (board: BoardItem[], currentToken: Token, currentPlayer: Player) => {
    if (winCheck(board, currentToken)) return currentPlayer === Player.Human ? GameState.WIN : GameState.LOSE;
    if (drawCheck(board)) return GameState.DRAW;
    return currentPlayer === Player.Human ? GameState.AI_TURN : GameState.HUMAN_TURN;
};

export const getNextColumnItem = (board: BoardItem[], columnFirstIndex: number) => {
    const columnItems = getColumnItems(columnFirstIndex, board);
    const emptyColumnItems = columnItems.filter((item) => item.currentToken === null);
    return emptyColumnItems[emptyColumnItems.length - 1];
};

export const getAvailableMoves = (board: BoardItem[]) => {
    const availableMoves = [];
    for (let i = 0; i < BOARD_WIDTH; i++) {
        const availableColumnItem = getNextColumnItem(board, i);
        if (availableColumnItem) availableMoves.push(availableColumnItem);
    }
    return availableMoves;
};

interface GetNextGameDataOptions {
    currentBoard: Board;
    moveIndex: number;
    player: Player;
    currentToken: Token;
}

export const getNextGameData = ({ currentBoard, moveIndex, player, currentToken }: GetNextGameDataOptions) => {
    const newBoard = currentBoard.map((item) => (item.index === moveIndex ? { ...item, currentToken } : item));
    return {
        board: newBoard,
        gameStatus: getNewGameStatus(newBoard, currentToken, player),
    };
};
