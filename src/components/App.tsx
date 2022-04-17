import { useCallback, useEffect, useState } from 'react';
import { AI } from '../AI';
import { GameData, GameState, Player, Token } from '../types';
import { getNextColumnItem, getNewBoard, getNextGameData } from '../utils';
import BoardItem from './BoardItem';
import GameStatusText from './GameStatusText';

const App = () => {
    const [gameData, setGameData] = useState<GameData>({
        board: getNewBoard(),
        gameStatus: GameState.HUMAN_TURN,
    });

    /** Do human move */
    const handleBoardItemClick = (columnIndex: number) => {
        if (gameData.gameStatus !== GameState.HUMAN_TURN) return;
        const rowIndex = getNextColumnItem(gameData.board, columnIndex);
        console.log({ rowIndex, columnIndex });
        if (rowIndex === null) return;

        setGameData((currentState) => {
            return getNextGameData({
                currentBoard: currentState.board,
                placedColumnIndex: columnIndex,
                placedRowIndex: rowIndex,
                player: Player.Human,
                currentToken: Token.Red,
            });
        });
    };

    const handleAIMove = useCallback(() => {
        const ai = new AI(gameData.board, Token.Yellow);
        const { columnIndex, rowIndex } = ai.getMoveIndex();

        setGameData((currentState) => {
            return getNextGameData({
                currentBoard: currentState.board,
                placedColumnIndex: columnIndex,
                placedRowIndex: rowIndex,
                player: Player.Ai,
                currentToken: Token.Yellow,
            });
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
                {gameData.board.map((column, columnIndex) => (
                    <div className="column" key={columnIndex}>
                        {column.reverse().map((item, rowIndex) => (
                            <BoardItem
                                key={`${columnIndex}-${rowIndex}`}
                                item={item}
                                columnIndex={columnIndex}
                                text={`${columnIndex}-${rowIndex}`}
                                onClick={handleBoardItemClick}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <GameStatusText gameState={gameData.gameStatus} />
        </div>
    );
};

export default App;
