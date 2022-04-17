import { GameState, Player, Token } from './types';
import {
    drawCheck,
    getAvailableMoves,
    getNewBoard,
    getNewGameStatus,
    getNextColumnItem,
    getNextGameData,
    winCheck,
} from './utils';

describe('utils', () => {
    describe('getNewBoard function', () => {
        it('should return a new board', () => {
            const board = getNewBoard();
            const rows = board[0];
            const item = board[0][0];
            expect(board).toHaveLength(7);
            expect(rows).toHaveLength(6);
            expect(item).toEqual(null);
        });
    });

    // describe('getColumnItems function', () => {
    //     it('should return an array of 6 items', () => {
    //         const board = getNewBoard();
    //         const columnFirstIndex = findColumnFirstIndex(0);
    //         const columnItems = getColumnItems(columnFirstIndex, board);
    //         expect(columnItems).toHaveLength(6);
    //     });
    // });

    describe('drawCheck function', () => {
        it('should return true if all items are filled', () => {
            const board = getNewBoard();
            const filledBoard = board.map((row) => row.map(() => Token.Red));
            expect(drawCheck(filledBoard)).toBeTruthy();
        });

        it('should return false if all items are not filled', () => {
            const board = getNewBoard();
            expect(drawCheck(board)).toBeFalsy();
        });
    });

    describe('winCheck function', () => {
        it('should return true if there is a row win', () => {
            const diagonalWinBoard = [
                [Token.Yellow, Token.Yellow, null, null, null, null],
                [Token.Red, null, null, null, null, null],
                [Token.Red, null, null, null, null, null],
                [Token.Red, null, null, null, null, null],
                [Token.Red, null, null, null, null, null],
                [Token.Yellow, null, null, null, null, null],
                [null, null, null, null, null, null],
            ];
            expect(winCheck(diagonalWinBoard, 4, 0)).toBeTruthy();
        });

        it('should return true if there is a column win', () => {
            const diagonalWinBoard = [
                [Token.Yellow, Token.Yellow, null, null, null, null],
                [Token.Red, Token.Red, Token.Red, Token.Red, null, null],
                [Token.Yellow, Token.Yellow, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
            ];
            expect(winCheck(diagonalWinBoard, 1, 3)).toBeTruthy();
        });

        it('should return true if there is a diagonal win', () => {
            const diagonalWinBoard = [
                [Token.Red, null, null, null, null, null],
                [Token.Yellow, Token.Red, null, null, null, null],
                [Token.Yellow, Token.Yellow, Token.Red, null, null, null],
                [Token.Yellow, Token.Yellow, Token.Yellow, Token.Red, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
            ];
            expect(winCheck(diagonalWinBoard, 3, 3)).toBeTruthy();
        });

        it('should return true if there is a other direction diagonal win', () => {
            const diagonalWinBoard = [
                [Token.Yellow, Token.Yellow, Token.Yellow, Token.Red, null, null],
                [Token.Yellow, Token.Yellow, Token.Red, null, null, null],
                [Token.Yellow, Token.Red, null, null, null, null],
                [Token.Red, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
            ];
            expect(winCheck(diagonalWinBoard, 3, 0)).toBeTruthy();
        });

        it('should return false if there is no win', () => {
            const noWinBoard = getNewBoard();
            expect(winCheck(noWinBoard, 0, 0)).toBeFalsy();
        });
    });

    // describe('getNewGameStatus function', () => {
    //     it('should return a new game status', () => {
    //         const board = getNewBoard();
    //         const gameStatus = getNewGameStatus(board, Token.Red, Player.Human);
    //         expect(gameStatus).toBe(GameState.AI_TURN);
    //     });
    // });

    describe('getNextColumnItem function', () => {
        it('should return the next column item', () => {
            const board = getNewBoard();
            const nextColumnItem = getNextColumnItem(board, 1);
            expect(nextColumnItem).toBe(0);
        });

        it('should return the null if no next item', () => {
            const board = getNewBoard();
            const filledBoard = board.map((row) => row.map((item) => Token.Red));
            const nextColumnItem = getNextColumnItem(filledBoard, 0);
            expect(nextColumnItem).toBe(null);
        });
    });

    describe('getAvailableMoves function', () => {
        it('should return an array of available moves', () => {
            const board = getNewBoard();
            const availableMoves = getAvailableMoves(board);
            expect(availableMoves).toHaveLength(7);
        });

        it('should return an empty array if all moves are filled', () => {
            const board = getNewBoard();
            const filledBoard = board.map((row) => row.map((item) => Token.Red));
            const availableMoves = getAvailableMoves(filledBoard);
            expect(availableMoves).toHaveLength(0);
        });
    });

    describe('getNewGameStatus function', () => {
        it('should return a new game status', () => {
            const board = getNewBoard();
            const gameStatus = getNewGameStatus(board, Player.Human, 6, 0);
            expect(gameStatus).toBe(GameState.AI_TURN);
        });
    });

    describe('getNextGameData function', () => {
        it('should return a new game data', () => {
            const currentBoard = getNewBoard();
            const gameData = getNextGameData({
                currentBoard,
                player: Player.Human,
                currentToken: Token.Red,
                placedColumnIndex: 6,
                placedRowIndex: 0,
            });
            expect(gameData).toEqual({
                board: [
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, null],
                    [null, null, null, null, null, null],
                    [Token.Red, null, null, null, null, null],
                ],
                gameStatus: GameState.AI_TURN,
            });
        });
    });
});
