import { GameState } from '../types';

interface GameStatusTextProps {
    gameState: GameState;
}

const getGameStatusText = (gameState: GameState) => {
    switch (gameState) {
        case GameState.HUMAN_TURN:
            return 'Your turn';
        case GameState.AI_TURN:
            return 'AI turn';
        case GameState.DRAW:
            return 'Draw';
        case GameState.WIN:
            return 'You win';
        case GameState.LOSE:
            return 'You lose';
        default:
            return null;
    }
};

const GameStatusText = ({ gameState }: GameStatusTextProps) => {
    const statusText = getGameStatusText(gameState);
    if (!statusText) return null;
    return <div className="status">{statusText}</div>;
};

export default GameStatusText;
