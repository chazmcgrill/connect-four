import { useState } from 'react';

enum Token {
    Red,
    Yellow,
}
interface BoardItem {
    index: number;
    currentPlayer: Token | null;
}

const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const GAME_ARRAY: BoardItem[] = Array(BOARD_WIDTH * BOARD_HEIGHT)
    .fill(null)
    .map((_, index) => ({ index, currentPlayer: null }));

const findColumnFirstIndex = (columnIndex: number): number => {
    if (columnIndex < BOARD_WIDTH) return columnIndex;
    return findColumnFirstIndex(columnIndex - BOARD_WIDTH);
};

const App = () => {
    const [gameArray, setGameArray] = useState(GAME_ARRAY);

    const handleClick = (index: number) => {
        // find empty column items with game array
        const columnFirstIndex = findColumnFirstIndex(index);
        const columnItems = [];
        for (let i = columnFirstIndex; i < BOARD_WIDTH * BOARD_HEIGHT; i += BOARD_WIDTH) {
            const columnItem = gameArray[i];
            if (columnItem.currentPlayer === null) columnItems.push(columnItem);
        }
        const lastEmptyItem = columnItems[columnItems.length - 1];
        if (!lastEmptyItem) return;

        // set current player to last empty item
        setGameArray((currentState) => {
            return currentState.map((item) =>
                item.index === lastEmptyItem.index ? { ...item, currentPlayer: Token.Red } : item,
            );
        });
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
