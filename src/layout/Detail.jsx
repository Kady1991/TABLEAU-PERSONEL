import React, { useState, useEffect } from 'react';
import { GoListOrdered } from "react-icons/go";

const Detail = ({ IDPersonne }) => {
    const [personData, setPersonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!showModal) return;
            if (IDPersonne) {
                try {
                    setLoading(true);
                    const response = await fetch(`https://server-iis.uccle.intra/API_Personne/api/Personne/${IDPersonne}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data = await response.json();
                    setPersonData(data);
                    setLoading(false);
                } catch (error) {
                    setError(error);
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [IDPersonne, showModal]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Icône d'information */}
            <GoListOrdered
                title="Voir les détails"
                onClick={handleOpenModal}
                style={{ fontSize: "22px", cursor: 'pointer', marginTop:"10px", color:"green", position: 'relative' }} // Définit la taille de l'icône et le curseur
            />

            {/* Modal pour afficher les détails */}
            {showModal && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error.message}</p>}
                        {personData && (
                            <>
                                <h2>Détails de la personne</h2>
                                <p>ID: {personData.IDPersonne}</p>
                                <p>Nom: {personData.nomPersonne}</p>
                                <p>Prénom: {personData.prenomPersonne}</p>
                                <p>Email: {personData.email}</p>
                                <p>Téléphone professionnel: {personData.TelPro}</p>
                                <p>Date d'entrée: {personData.DateEntree}</p>
                                
                                {/* Ajoutez d'autres champs si nécessaire */}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Detail;
