import React, { useState } from 'react';
import { RiInformationLine } from 'react-icons/ri';

const Detail = ({ columnId, data }) => {
    const [showWindow, setShowWindow] = useState(false);
    const [detailData, setDetailData] = useState(null);

    const handleClick = () => {
        const columnData = data.find(item => item.id === columnId);
        setDetailData(columnData);
        setShowWindow(true);
    };

    return (
        <div>
            {/* Icône d'information */}
            <RiInformationLine
                title="Voir les détails"
                onClick={handleClick}
                style={{ fontSize: 24, cursor: 'pointer' }} // Définit la taille de l'icône et le curseur
            />

            {/* Fenêtre détaillée */}
            {showWindow && (
                <div className="detail-window">
                    {/* Affichage des détails */}
                    {detailData && (
                        <div>
                            <h2>Détails de la colonne {detailData.id}</h2>
                            <p>Champ 1: {detailData.field1}</p>
                            <p>Champ 2: {detailData.field2}</p>
                            {/* Ajoutez autant de champs que nécessaire */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Detail;
