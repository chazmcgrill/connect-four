import { Token, BoardItem as BoardItemType } from '../types';

interface BoardItemProps {
    item: BoardItemType;
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

const BoardItem = ({ item, onClick }: BoardItemProps) => {
    const backgroundColor = getTokenBackgroundColor(item.currentToken);
    return (
        <div className="board-item" style={{ backgroundColor }} onClick={() => onClick(item.index)}>
            {item.index}
        </div>
    );
};

export default BoardItem;
