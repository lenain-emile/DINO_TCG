import React from 'react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'collection', label: 'Collection', icon: '🎴' },
    { id: 'decks', label: 'Mes Decks', icon: '⚔️' },
    { id: 'shop', label: 'Boutique', icon: '💰' },
  ];

  return (
    <nav style={navStyle}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentPage(tab.id)}
          style={{
            ...tabStyle,
            color: currentPage === tab.id ? '#ffcc00' : '#888',
            borderTop: currentPage === tab.id ? '2px solid #ffcc00' : 'none'
          }}
        >
          <span style={{ fontSize: '20px' }}>{tab.icon}</span>
          <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '70px',
  backgroundColor: '#161616',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  zIndex: 100,
  paddingBottom: 'env(safe-area-inset-bottom)', // Pour les iPhone récents
};

const tabStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  transition: '0.3s',
  flex: 1,
  height: '100%',
  justifyContent: 'center'
};