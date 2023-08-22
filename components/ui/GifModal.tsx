// GifModal.tsx

import { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid, Carousel } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';


interface Props {
    onGifSelect: (gif: IGif) => void;
    onClose: () => void;
}

function GifModal({ onGifSelect }: Props) {

    const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY || "");

    const [search, setSearch] = useState('');

    const fetchGifs = (offset: number) => {
        return gf.search(search, { offset, limit: 10 })
    }

    return (
        <Grid
            onGifClick={onGifSelect}
            fetchGifs={fetchGifs}
            columns={3}
            width={800}
            gutter={6}
            noResultsMessage="No GIFs found"
        />
    )

}