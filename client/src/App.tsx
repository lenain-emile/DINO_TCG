import { useState } from 'react';
import data from './shared/data/dinosaurs.json';
import { CardTCG } from './shared/ui/CardTCG.tsx';
import { Navbar } from './shared/ui/Navbar.tsx';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('collection'); // Page par défaut

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <div style={pagePadding}><h1>Bienvenue, Dresseur !</h1><p>Prêt pour un duel ?</p></div>;
      
      case 'collection':
        return (
          <div style={pagePadding}>
            <h1 style={{ textAlign: 'center' }}>Ma Collection</h1>
            <div className="deck-grid">
              {data.cartes_dinosaures.map((dino) => (
                <CardTCG key={dino.id} dino={dino} />
              ))}
            </div>
          </div>
        );

      case 'decks':
        return <div style={pagePadding}><h1>Mes Decks</h1><p>Créez votre équipe de choc ici.</p></div>;

      default:
        return <div style={pagePadding}><h1>Bientôt disponible</h1></div>;
    }
  };

  return (
    <div className="app-container">
      {/* Contenu dynamique */}
      <main style={{ paddingBottom: '80px' }}> {/* On laisse de la place pour la navbar */}
        {renderPage()}
      </main>

      {/* Barre de navigation fixe */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

const pagePadding: React.CSSProperties = {
  padding: '20px',
  maxWidth: '1200px',
  margin: '0 auto'
};

export default App;