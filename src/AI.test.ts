import { AI } from './AI';
import { Token } from './types';
import { getNewBoard } from './utils';

describe('getMove (minimax)', () => {
    it('should prevent opponent from winning next move', () => {
        const aboutToWinBoard = getNewBoard();
        aboutToWinBoard[35].currentToken = Token.Red;
        aboutToWinBoard[36].currentToken = Token.Red;
        aboutToWinBoard[37].currentToken = Token.Red;
        const aiInstance = new AI(aboutToWinBoard, Token.Yellow);
        expect(aiInstance.getMoveIndex()).toEqual(38);
    });

    it('should win when possible', () => {
        const aboutToLoseBaord = getNewBoard();
        aboutToLoseBaord[35].currentToken = Token.Yellow;
        aboutToLoseBaord[36].currentToken = Token.Yellow;
        aboutToLoseBaord[37].currentToken = Token.Yellow;
        const aiInstance = new AI(aboutToLoseBaord, Token.Yellow);
        expect(aiInstance.getMoveIndex()).toEqual(38);
    });
});
