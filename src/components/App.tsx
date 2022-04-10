import { useCallback, useEffect, useState } from 'react';
import { BoardItem, GameData, GameState, Player, Token } from '../types';
import GameStatusText from './GameStatusText';

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const WIN_LENGTH = 4;

export const getNewBoard = (): BoardItem[] =>
    Array(BOARD_WIDTH * BOARD_HEIGHT)
        .fill(null)
        .map((_, index) => ({ index, currentToken: null }));

const findColumnFirstIndex = (columnIndex: number): number => {
    if (columnIndex < BOARD_WIDTH) return columnIndex;
    return findColumnFirstIndex(columnIndex - BOARD_WIDTH);
};

const getTokenBackgroundColor = (item: BoardItem) => {
    switch (item?.currentToken) {
        case Token.Red:
            return 'red';
        case Token.Yellow:
            return 'yellow';
        default:
            return 'white';
    }
};

const getColumnItems = (columnFirstIndex: number, board: BoardItem[]) => {
    const columnItems = [];
    for (let i = columnFirstIndex; i < BOARD_WIDTH * BOARD_HEIGHT; i += BOARD_WIDTH) {
        const columnItem = board[i];
        columnItems.push(columnItem);
    }
    return columnItems;
};

const drawCheck = (board: BoardItem[]) => {
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
            if (count === WIN_LENGTH) hasWin = true;
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
            if (count === WIN_LENGTH) hasWin = true;
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
const getNewGameStatus = (board: BoardItem[], currentToken: Token, currentPlayer: Player) => {
    if (winCheck(board, currentToken)) return currentPlayer === Player.Human ? GameState.WIN : GameState.LOSE;
    if (drawCheck(board)) return GameState.DRAW;
    return currentPlayer === Player.Human ? GameState.AI_TURN : GameState.HUMAN_TURN;
};

const App = () => {
    const [gameData, setGameData] = useState<GameData>({
        board: getNewBoard(),
        gameStatus: GameState.HUMAN_TURN,
    });

    const handleClick = (index: number) => {
        if (gameData.gameStatus !== GameState.HUMAN_TURN) return;
        // find empty column items with game array
        const columnFirstIndex = findColumnFirstIndex(index);
        const columnItems = getColumnItems(columnFirstIndex, gameData.board);
        const emptyColumnItems = columnItems.filter((item) => item.currentToken === null);
        const lastEmptyItem = emptyColumnItems[emptyColumnItems.length - 1];
        if (!lastEmptyItem) return;

        setGameData((currentState) => {
            const newBoard = currentState.board.map((item) =>
                item.index === lastEmptyItem.index ? { ...item, currentPlayer: Token.Red } : item,
            );
            return {
                board: newBoard,
                gameStatus: getNewGameStatus(newBoard, Token.Red, Player.Human),
            };
        });
    };

    const handleAIMove = useCallback(() => {
        // find available moves
        const availableMoves = [];
        for (let i = 0; i < BOARD_WIDTH; i++) {
            const columnItems = getColumnItems(i, gameData.board);
            const emptyColumnItems = columnItems.filter((item) => item.currentToken === null);
            const lastEmptyItem = emptyColumnItems[emptyColumnItems.length - 1];
            if (lastEmptyItem) availableMoves.push(lastEmptyItem);
        }

        // randomly select one of the moves
        const randomAIMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

        setGameData((currentState) => {
            const newBoard = currentState.board.map((item) =>
                item.index === randomAIMove.index ? { ...item, currentPlayer: Token.Yellow } : item,
            );
            return {
                board: newBoard,
                gameStatus: getNewGameStatus(newBoard, Token.Yellow, Player.Ai),
            };
        });
    }, [gameData.board]);

    useEffect(() => {
        if (gameData.gameStatus === GameState.AI_TURN) {
            handleAIMove();
        }
    }, [gameData.gameStatus, handleAIMove]);

    return (
        <div className="App">
            <div className="board">
                {gameData.board.map((item) => (
                    <div
                        key={item.index}
                        className="board-item"
                        style={{
                            backgroundColor: getTokenBackgroundColor(item),
                        }}
                        onClick={() => handleClick(item.index)}
                    >
                        {item.index}
                    </div>
                ))}
            </div>
            <GameStatusText gameState={gameData.gameStatus} />
        </div>
    );
};

export default App;
