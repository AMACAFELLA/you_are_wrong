import React from 'react';

interface Props {
    onClick: () => void;
}

function GifButton({ onClick }: Props) {
    return (
        <button onClick={onClick} className="gif-button">
            GIF
        </button>
    );
}

export default GifButton;
