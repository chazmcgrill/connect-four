import { Token } from './types';
import { drawCheck, findColumnFirstIndex, getColumnItems, getNewBoard, winCheck } from './utils';

describe('utils', () => {
    describe('getNewBoard function', () => {
        it('should return an array of 7 * 6 items with null values', () => {
            const board = getNewBoard();
            expect(board.filter((item) => item.currentToken === null)).toHaveLength(42);
        });

        it('should return an array of 7 * 6 items with index values', () => {
            const board = getNewBoard();
            expect(board.filter((item) => item.index === null)).toHaveLength(0);
        });
    });

    describe('findColumnFirstIndex function', () => {
        it('should return correct column index', () => {
            expect(findColumnFirstIndex(0)).toBe(0);
            expect(findColumnFirstIndex(36)).toBe(1);
            expect(findColumnFirstIndex(37)).toBe(2);
        });
    });

    describe('getColumnItems function', () => {
        it('should return an array of 6 items', () => {
            const board = getNewBoard();
            const columnFirstIndex = findColumnFirstIndex(0);
            const columnItems = getColumnItems(columnFirstIndex, board);
            expect(columnItems).toHaveLength(6);
        });
    });

    describe('drawCheck function', () => {
        it('should return true if all items are filled', () => {
            const board = getNewBoard();
            board.forEach((item) => {
                item.currentToken = Token.Red;
            });
            expect(drawCheck(board)).toBe(true);
        });

        it('should return false if all items are not filled', () => {
            const board = getNewBoard();
            expect(drawCheck(board)).toBe(false);
        });
    });

    describe('winCheck function', () => {
        it('should return true if there is a row win', () => {
            const board = getNewBoard();
            board.forEach((item, index) => {
                item.currentToken = index % 2 === 0 ? Token.Red : Token.Yellow;
            });
            expect(winCheck(board, Token.Red)).toBe(true);
        });

        it('should return true if there is a column win', () => {
            const board = getNewBoard();
            board.forEach((item, index) => {
                item.currentToken = index % 2 === 0 ? Token.Red : Token.Yellow;
            });
            expect(winCheck(board, Token.Red)).toBe(true);
        });

        it('should return true if there is a diagonal win', () => {
            const board = getNewBoard();
            board.forEach((item, index) => {
                item.currentToken = index % 2 === 0 ? Token.Red : Token.Yellow;
            });
            expect(winCheck(board, Token.Red)).toBe(true);
        });
    });
});
