import { Token, BoardItem as BoardItemType } from '../types';

interface BoardItemProps {
    item: BoardItemType;
    columnIndex: number;
    text: string;
    onClick: (index: number) => void;
}

export const getTokenBackgroundColor = (currentToken: Token | null) => {
    switch (currentToken) {
        case Token.Red:
            return 'red';
        case Token.Yellow:
            return 'yellow';
        default:
            return 'white';
    }
};

const BoardItem = ({ item, onClick, columnIndex, text }: BoardItemProps) => {
    const backgroundColor = getTokenBackgroundColor(item);
    return (
        <div className="board-item" style={{ backgroundColor }} onClick={() => onClick(columnIndex)}>
            {text}
        </div>
    );
};

export default BoardItem;
