const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 6;
const GAME_ARRAY = Array(BOARD_WIDTH * BOARD_HEIGHT).fill(null);

const App = () => {
    return (
        <div className="App">
            <div className="board">
                {GAME_ARRAY.map((value, index) => (
                    <div key={index} className="board-item"></div>
                ))}
            </div>
        </div>
    );
};

export default App;
