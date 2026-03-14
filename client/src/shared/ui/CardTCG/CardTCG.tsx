import type { CardTCGProps } from "../../types/card";
import { RARITY_GRADIENTS } from "../../config/rarity";
import { StyledCardTCG } from "./CardTCG.styles";

export function CardTCG({
  name,
  type,
  image,
  atk,
  def,
  life,
  priceMana,
  rarity,
  specialEffect,
}: CardTCGProps) {
  const gradient = RARITY_GRADIENTS[rarity] ?? RARITY_GRADIENTS.common;

  return (
    <StyledCardTCG $from={gradient.from} $to={gradient.to}>
      <div className="card">
        <div className="top-section">
          <div className="border" />
          <div className="icons">
            <div className="mana-cost">
              <span>{priceMana}</span>
            </div>
            <div className="rarity-badge">
              {rarity.toUpperCase()}
            </div>
          </div>
          {image && <img src={image} alt={name} className="card-image" />}
        </div>

        <div className="bottom-section">
          <span className="title">{name}</span>
          <span className="type">{type}</span>

          {specialEffect && (
            <span className="effect">{specialEffect}</span>
          )}

          <div className="row">
            <div className="item">
              <span className="big-text">{atk}</span>
              <span className="regular-text">ATK</span>
            </div>
            <div className="item">
              <span className="big-text">{def}</span>
              <span className="regular-text">DEF</span>
            </div>
            <div className="item">
              <span className="big-text">{life}</span>
              <span className="regular-text">VIE</span>
            </div>
          </div>
        </div>
      </div>
    </StyledCardTCG>
  );
}
