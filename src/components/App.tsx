import { useCallback, useEffect, useState } from 'react';
import { BoardItem, GameData, GameState, Player, Token } from '../types';
import GameStatusText from './GameStatusText';

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const GAME_ARRAY: BoardItem[] = Array(BOARD_WIDTH * BOARD_HEIGHT)
    .fill(null)
    .map((_, index) => ({ index, currentPlayer: null }));

const findColumnFirstIndex = (columnIndex: number): number => {
    if (columnIndex < BOARD_WIDTH) return columnIndex;
    return findColumnFirstIndex(columnIndex - BOARD_WIDTH);
};

const getTokenBackgroundColor = (item: BoardItem) => {
    switch (item?.currentPlayer) {
        case Token.Red:
            return 'red';
        case Token.Yellow:
            return 'yellow';
        default:
            return 'white';
    }
};

const getColumnItems = (columnFirstIndex: number, gameArray: BoardItem[]) => {
    const columnItems = [];
    for (let i = columnFirstIndex; i < BOARD_WIDTH * BOARD_HEIGHT; i += BOARD_WIDTH) {
        const columnItem = gameArray[i];
        if (columnItem.currentPlayer === null) columnItems.push(columnItem);
    }
    return columnItems;
};

const drawCheck = (gameArray: BoardItem[]) => {
    return gameArray.filter((item) => item.currentPlayer === null).length === 0;
};

/** Gets the new game status at the end of a turn */
const getNewGameStatus = (board: BoardItem[], currentToken: Token, currentPlayer: Player) => {
    // if (winCheck(board, currentToken)) return currentPlayer === Player.Human ? GameState.WIN : GameState.LOSE;
    if (drawCheck(board)) return GameState.DRAW;
    return currentPlayer === Player.Human ? GameState.AI_TURN : GameState.HUMAN_TURN;
};

const App = () => {
    const [gameData, setGameData] = useState<GameData>({
        board: GAME_ARRAY,
        gameStatus: GameState.HUMAN_TURN,
    });

    const handleClick = (index: number) => {
        // find empty column items with game array
        const columnFirstIndex = findColumnFirstIndex(index);
        const columnItems = getColumnItems(columnFirstIndex, gameData.board);
        const lastEmptyItem = columnItems[columnItems.length - 1];
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
            const lastEmptyItem = columnItems[columnItems.length - 1];
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
