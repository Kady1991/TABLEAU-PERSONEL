import React from "react";
import Membre from "./components/Membre";
import './index.css'; // Assurez-vous que le chemin est correct vers votre fichier index.css

function App() {
  return (
    <div className="App">
      <h1 className="title">
        LES MEMBRES DU PERSONEL UCCLE
      </h1>
      <Membre />
    </div>
  );
}

export default App;


