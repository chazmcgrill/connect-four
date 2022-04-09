import { useCallback, useEffect, useState } from 'react';

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const GAME_ARRAY: BoardItem[] = Array(BOARD_WIDTH * BOARD_HEIGHT)
    .fill(null)
    .map((_, index) => ({ index, currentPlayer: null }));

enum Token {
    Red,
    Yellow,
}

enum Player {
    Human,
    Ai,
}
interface BoardItem {
    index: number;
    currentPlayer: Token | null;
}

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

const App = () => {
    const [gameArray, setGameArray] = useState(GAME_ARRAY);
    const [currentPlayer, setCurrentPlayer] = useState(Player.Human);

    const handleClick = (index: number) => {
        // find empty column items with game array
        const columnFirstIndex = findColumnFirstIndex(index);
        const columnItems = getColumnItems(columnFirstIndex, gameArray);
        const lastEmptyItem = columnItems[columnItems.length - 1];
        if (!lastEmptyItem) return;

        // set current player to last empty item
        setGameArray((currentState) => {
            return currentState.map((item) =>
                item.index === lastEmptyItem.index ? { ...item, currentPlayer: Token.Red } : item,
            );
        });
        setCurrentPlayer(Player.Ai);
    };

    const handleAIMove = useCallback(() => {
        // find available moves
        const availableMoves = [];
        for (let i = 0; i < BOARD_WIDTH; i++) {
            const columnItems = getColumnItems(i, gameArray);
            const lastEmptyItem = columnItems[columnItems.length - 1];
            if (lastEmptyItem) availableMoves.push(lastEmptyItem);
        }

        // randomly select one of the moves
        const randomAIMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

        setCurrentPlayer(Player.Human);
        // set current player to last empty item
        setGameArray((currentState) => {
            return currentState.map((item) =>
                item.index === randomAIMove.index ? { ...item, currentPlayer: Token.Yellow } : item,
            );
        });
    }, [gameArray]);

    useEffect(() => {
        if (currentPlayer === Player.Ai) {
            handleAIMove();
        }
    }, [currentPlayer, handleAIMove]);

    return (
        <div className="App">
            <div className="board">
                {gameArray.map((item) => (
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
        </div>
    );
};

export default App;
