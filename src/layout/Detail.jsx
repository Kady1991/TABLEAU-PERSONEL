import React, { useState } from 'react'; // Importez useState depuis 'react'
import { TbListDetails } from "react-icons/tb"; // Importez MdDetails depuis 'react-icons/md'
import axios from 'axios'; // Importez axios depuis 'axios'

const Detail = ({ onClick, personId }) => {
    const [modalOpen, setModalOpen] = useState(false); // Utilisez useState pour le state modalOpen

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleClick = async () => {
        try {
            // Effectuez une requête à votre API pour récupérer les détails de la personne
            const response = await axios.get(`https://server-iis.uccle.intra/API_Personne/api/Personne/${personId}`);
            const personDetails = response.data; // Les détails de la personne seront dans response.data
            
            // Appelez la fonction onClick avec les détails de la personne
            onClick(personDetails);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la personne :', error);
            // Gérez l'erreur, par exemple afficher un message à l'utilisateur
        }
    };

    return (
        <div>
         <TbListDetails  title='Détails' onClick={handleClick} style={{ cursor: 'pointer', color: '#008000', fontSize: '20px' }} />
        </div>
    );
};

export default Detail;
