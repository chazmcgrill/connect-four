export enum GameState {
    CHOOSING_PLAYER,
    HUMAN_TURN,
    AI_TURN,
    DRAW,
    WIN,
    LOSE,
}

export type BoardItem = Token | null;

export type Board = BoardItem[][];

export interface GameData {
    board: Board;
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
