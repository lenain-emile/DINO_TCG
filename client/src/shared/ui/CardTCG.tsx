import React from 'react';
import type { Dinosaur } from '../types/card';

interface CardProps {
  dino: Dinosaur;
}

const normalizeText = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const getIconPath = (type: string) => `/ressources/icones/${type}.png`;

export const CardTCG: React.FC<CardProps> = ({ dino }) => {
  const templatePath = `/ressources/templates/${normalizeText(dino.faction)}.png`;
  const dinoPath = `/ressources/images/${dino.nom}.png`;
  const rarityClass = `rarity-${normalizeText(dino.rarete)}`;

  return (
    <article className={`card-container ${rarityClass}`}>
      {/* Template de base */}
      <img
        src={templatePath}
        alt={dino.faction}
        className="card-template"
      />

      {/* Fond animé derrière le dino */}
      <div className="card-bg-motion" />

      {/* Overlays visuels */}
      <div className="rarity-overlay" />
      <div className="rarity-frame" />
      <div className="rarity-noise" />
      <div className="specular-highlight" />

      {/* Contenu */}
      <div className="card-content">
        <div className="card-title-wrapper">
          <h3 className="card-title">{dino.nom}</h3>
        </div>

        <div className="card-dino">
          <img
            src={dinoPath}
            alt={dino.nom}
            className="card-dino-image"
          />
        </div>

        <div className="card-stats">
          <div className="card-stat-item">
            <img src={getIconPath('Heart')} alt="Vie" className="card-stat-icon" />
            <span className="card-stat-text">{dino.points_de_vie}</span>
          </div>

          <div className="card-stat-item">
            <img src={getIconPath('Sword')} alt="Attaque" className="card-stat-icon" />
            <span className="card-stat-text">{dino.attaque}</span>
          </div>

          <div className="card-stat-item">
            <img src={getIconPath('Shield')} alt="Défense" className="card-stat-icon" />
            <span className="card-stat-text">{dino.defense}</span>
          </div>
        </div>
      </div>
    </article>
  );
};