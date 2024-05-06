import React from 'react';
import { MdDetails } from 'react-icons/md'; // Import de l'icône MdDetails depuis react-icons/md

const Detail = ({ onClick }) => {
    return (
        <MdDetails onClick={onClick} style={{ cursor: 'pointer', color: '#7da86f', fontSize: '20px' }} />
    );
};

export default Detail;
