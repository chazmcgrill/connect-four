import { useCallback, useEffect, useState } from 'react';
import { AI } from '../AI';
import { GameData, GameState, Player, Token } from '../types';
import { findColumnFirstIndex, getNextColumnItem, getNewBoard, getNextGameData } from '../utils';
import BoardItem from './BoardItem';
import GameStatusText from './GameStatusText';

const App = () => {
    const [gameData, setGameData] = useState<GameData>({
        board: getNewBoard(),
        gameStatus: GameState.HUMAN_TURN,
    });

    /** Do human move */
    const handleBoardItemClick = (index: number) => {
        if (gameData.gameStatus !== GameState.HUMAN_TURN) return;
        const columnFirstIndex = findColumnFirstIndex(index);
        const availableItem = getNextColumnItem(gameData.board, columnFirstIndex);
        if (!availableItem) return;

        setGameData((currentState) => {
            return getNextGameData({
                currentBoard: currentState.board,
                moveIndex: availableItem.index,
                player: Player.Human,
                currentToken: Token.Red,
            });
        });
    };

    const handleAIMove = useCallback(() => {
        const ai = new AI(gameData.board, Token.Yellow);
        const moveIndex = ai.getMoveIndex();

        setGameData((currentState) => {
            return getNextGameData({
                currentBoard: currentState.board,
                moveIndex,
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
                {gameData.board.map((item) => (
                    <BoardItem key={item.index} item={item} onClick={handleBoardItemClick} />
                ))}
            </div>
            <GameStatusText gameState={gameData.gameStatus} />
        </div>
    );
};

export default App;
