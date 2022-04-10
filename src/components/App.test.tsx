import { Token } from '../types';
import { getNewBoard, winCheck } from '../utils';

describe('winCheck function', () => {
    it('should return true if column win is found', () => {
        const board = getNewBoard();
        board[19].currentToken = Token.Red;
        board[26].currentToken = Token.Red;
        board[33].currentToken = Token.Red;
        board[40].currentToken = Token.Red;

        const isWin = winCheck(board, Token.Red);
        expect(isWin).toBe(true);
    });

    it('should return true if row win is found', () => {
        const board = getNewBoard();
        board[30].currentToken = Token.Yellow;
        board[31].currentToken = Token.Yellow;
        board[32].currentToken = Token.Yellow;
        board[33].currentToken = Token.Yellow;

        const isWin = winCheck(board, Token.Yellow);
        expect(isWin).toBe(true);
    });

    it('should return true if right diagonal win is found', () => {
        const board = getNewBoard();
        board[41].currentToken = Token.Red;
        board[33].currentToken = Token.Red;
        board[25].currentToken = Token.Red;
        board[17].currentToken = Token.Red;

        const isWin = winCheck(board, Token.Red);
        expect(isWin).toBe(true);
    });

    it('should return true if left diagonal win is found', () => {
        const board = getNewBoard();
        board[20].currentToken = Token.Yellow;
        board[26].currentToken = Token.Yellow;
        board[32].currentToken = Token.Yellow;
        board[38].currentToken = Token.Yellow;

        const isWin = winCheck(board, Token.Yellow);
        expect(isWin).toBe(true);
    });
});
