import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Recherche = ({ data, setData }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filteredData = data.filter(item =>
            Object.values(item).some(val =>
                val.toString().toLowerCase().includes(value.toLowerCase())
            )
        );
        setData(filteredData);
    };

    return (
        <TextField
            label="Recherche"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton disabled>
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                '& .MuiInputBase-root': {
                    width: '300px', // Ajustez la largeur selon vos besoins
                },
            }}
        />
    );
};

export default Recherche;
