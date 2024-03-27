import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, InputBase, alpha } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import BtnCSV from '../components/BtnCSV'; // Assurez-vous que le chemin est correct

function Navbar({ members }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        const filteredMembers = members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filteredMembers);
    };

    const open = Boolean(anchorEl);

    return (
        <AppBar position="static">
            <Toolbar style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        MEMBRE DU PERSONEL
                    </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', paddingLeft: '8px' }}>
                        <SearchIcon style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </div>
                    <InputBase
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{
                            color: 'inherit',
                            marginLeft: '24px',
                            width: '100%',
                            borderRadius: '4px',
                            backgroundColor: alpha('#ffffff', 0.15),
                            paddingLeft: '36px',
                            paddingRight: '8px'
                        }}
                        />
                </div>
                {/* Bouton CSV avec les données filtrées */}
                <BtnCSV data={filteredMembers} />
                <div>
                    <IconButton
                        color="inherit"
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                        >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleMenuClose}>Action 1</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Action 2</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Action 3</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Action 4</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
            {/* Afficher les résultats de recherche ici */}
            {searchTerm && (
                <div style={{ padding: '10px', textAlign: 'center' }}>
                    Résultats de recherche pour : {searchTerm}
                    <ul>
                        {filteredMembers.map(member => (
                            <li key={member.id}>{member.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </AppBar>
    );
}

export default Navbar;
