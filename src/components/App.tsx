import { useCallback, useEffect, useState } from 'react';
import { GameData, GameState, Player, Token } from '../types';
import { findColumnFirstIndex, getNextColumnItem, getAvailableMoves, getNewBoard, getNextGameData } from '../utils';
import BoardItem from './BoardItem';
import GameStatusText from './GameStatusText';

const App = () => {
    const [gameData, setGameData] = useState<GameData>({
        board: getNewBoard(),
        gameStatus: GameState.HUMAN_TURN,
    });

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
        const availableMoves = getAvailableMoves(gameData.board);
        const randomAIMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

        setGameData((currentState) => {
            return getNextGameData({
                currentBoard: currentState.board,
                moveIndex: randomAIMove.index,
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
