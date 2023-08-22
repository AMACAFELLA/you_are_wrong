import React, { useState } from 'react';
import GifButton from './GifButton';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Grid } from '@giphy/react-components';

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || '');

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onGifSelect: (gif: IGif) => void;
}

function GifModal({ isOpen, onClose, onGifSelect }: Props) {
    const [gifs, setGifs] = useState<IGif[]>([]);
    const [selectedGif, setSelectedGif] = useState<IGif | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async () => {
        const searchResult = await gf.search(searchQuery, { limit: 10 });
        setGifs(searchResult.data);
    };

    const handleGifButtonClick = () => {
        if (selectedGif) {
            onGifSelect(selectedGif);
            setSelectedGif(null); // Reset selectedGif after inserting
        }
    };

    const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

    return (
        <div className={`gif-modal ${isOpen ? 'open' : ''}`}>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search GIFs..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button onClick={handleSearchSubmit}>Search</button>
            </div>
            {isOpen && (
                <div className="gif-modal-content">
                    <Grid onGifClick={setSelectedGif} fetchGifs={fetchGifs} width={800} columns={3} />
                    <button onClick={onClose}>Close</button>
                </div>
            )}
        </div>
    );
}

export default GifModal;
