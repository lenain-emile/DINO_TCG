import { CardTCG } from "./shared/ui/CardTCG/CardTCG";

function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <CardTCG
        name="T-Rex Alpha"
        type="Carnivore"
        atk={95}
        def={40}
        life={120}
        priceMana={7}
        rarity="legendary"
        specialEffect="Morsure de feu"
      />
    </div>
  );
}

export default App;
