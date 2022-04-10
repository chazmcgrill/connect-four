export enum GameState {
    CHOOSING_PLAYER,
    HUMAN_TURN,
    AI_TURN,
    DRAW,
    WIN,
    LOSE,
}

export interface BoardItem {
    index: number;
    currentToken: Token | null;
}

export interface GameData {
    board: BoardItem[];
    gameStatus: GameState;
}

export enum Token {
    Red,
    Yellow,
}

export enum Player {
    Human,
    Ai,
}
