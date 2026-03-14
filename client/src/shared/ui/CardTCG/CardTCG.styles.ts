import styled from "styled-components";

export const StyledCardTCG = styled.div<{ $from: string; $to: string }>`
  .card {
    width: 230px;
    border-radius: 20px;
    background: #1b233d;
    padding: 5px;
    overflow: hidden;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 20px 0px;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card .top-section {
    height: 180px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(
      45deg,
      ${({ $from }) => $from} 0%,
      ${({ $to }) => $to} 100%
    );
    position: relative;
    align-items: center;
    justify-content: center;
  }

  .card .top-section .border {
    border-bottom-right-radius: 10px;
    height: 30px;
    width: 130px;
    background: #1b233d;
    position: absolute;
    top: 0;
    left: 0;
    transform: skew(-40deg);
    box-shadow: -10px -10px 0 0 #1b233d;
  }

  .card .top-section .border::before {
    content: "";
    position: absolute;
    width: 15px;
    height: 15px;
    top: 0;
    right: -15px;
    background: transparent;
    border-top-left-radius: 10px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section::before {
    content: "";
    position: absolute;
    top: 30px;
    left: 0;
    background: transparent;
    height: 15px;
    width: 15px;
    border-top-left-radius: 15px;
    box-shadow: -5px -5px 0 2px #1b233d;
  }

  .card .top-section .icons {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card .top-section .icons .mana-cost {
    padding: 4px 0 0 12px;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }

  .card .top-section .icons .rarity-badge {
    padding: 4px 12px 0 0;
    font-size: 9px;
    font-weight: bold;
    color: white;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .card .top-section .card-image {
    max-height: 120px;
    max-width: 90%;
    object-fit: contain;
    z-index: 1;
  }

  .card .bottom-section {
    margin-top: 12px;
    padding: 8px 5px 10px;
  }

  .card .bottom-section .title {
    display: block;
    font-size: 16px;
    font-weight: bolder;
    color: white;
    text-align: center;
    letter-spacing: 2px;
  }

  .card .bottom-section .type {
    display: block;
    font-size: 10px;
    color: rgba(170, 222, 243, 0.7);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  .card .bottom-section .effect {
    display: block;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    font-style: italic;
    margin-top: 6px;
  }

  .card .bottom-section .row {
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
  }

  .card .bottom-section .row .item {
    flex: 1;
    text-align: center;
    padding: 5px;
    color: rgba(170, 222, 243, 0.72);
  }

  .card .bottom-section .row .item .big-text {
    font-size: 14px;
    font-weight: bold;
    display: block;
    color: white;
  }

  .card .bottom-section .row .item .regular-text {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .card .bottom-section .row .item:nth-child(2) {
    border-left: 1px solid rgba(255, 255, 255, 0.126);
    border-right: 1px solid rgba(255, 255, 255, 0.126);
  }
`;
