import React, { useState } from 'react';
import { GoListOrdered } from "react-icons/go";

const Detail = ({ 
    IDPersonne,
    nomPersonne,
    prenomPersonne,
    email,
    TelPro,
    DateEntree,
    WWGradeID,
    AdresseID,
    ServiceID,
    SiFrancais,
    SiServicePrincipal,
    SiTypePersonnel
}) => {
    const [showWindow, setShowWindow] = useState(false);

    const handleClick = () => {
        setShowWindow(true);
    };

    return (
        <div>
            {/* Icône d'information */}
            <GoListOrdered
                title="Voir les détails"
                onClick={handleClick}
                style={{ fontSize: "22px", cursor: 'pointer', marginTop:"10px", color:"green" }} // Définit la taille de l'icône et le curseur
            />

            {/* Fenêtre détaillée */}
            {showWindow && (
                <div className="detail-window">
                    {/* Affichage des détails */}
                    <div>
                        <h2>Détails de la personne</h2>
                        <p>ID: {IDPersonne}</p>
                        <p>Nom: {nomPersonne}</p>
                        <p>Prénom: {prenomPersonne}</p>
                        <p>Email: {email}</p>
                        <p>Téléphone professionnel: {TelPro}</p>
                        <p>Date d'entrée: {DateEntree}</p>
                        {/* Ajoutez d'autres champs si nécessaire */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Detail;
