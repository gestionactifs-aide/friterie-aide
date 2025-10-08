import React, { useState } from 'react';
import './App.css';

function App() {
  const [commandes, setCommandes] = useState([]);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouvelleFrite, setNouvelleFrite] = useState('Petite');
  const [nouvellesSauces, setNouvellesSauces] = useState([]);
  const [nouveauxSnacks, setNouveauxSnacks] = useState([]);

  const taillesFrites = [
    { nom: 'Mini', prix: 2.00 },
    { nom: 'Petite', prix: 2.50 },
    { nom: 'Moyenne', prix: 3.00 },
    { nom: 'Grande', prix: 3.50 },
    { nom: 'Spéciale', prix: 4.50 }
  ];

  const sauces = [
    { nom: 'Ketchup', prix: 0.80 },
    { nom: 'Tartare', prix: 0.80 },
    { nom: 'Mayonnaise', prix: 0.80 },
    { nom: 'Andalouse', prix: 0.80 },
    { nom: 'Cocktail', prix: 0.80 },
    { nom: 'Américaine du chef', prix: 0.80 },
    { nom: 'Samourai', prix: 0.80 },
    { nom: 'Aïoli', prix: 0.80 },
    { nom: 'Brazil', prix: 0.80 },
    { nom: 'Biche', prix: 0.80 },
    { nom: 'Ketchup curry', prix: 0.80 },
    { nom: 'Toscane', prix: 0.80 },
    { nom: 'Moutarde', prix: 0.80 },
    { nom: 'Béarnaise', prix: 0.80 },
    { nom: 'Autre doux', prix: 0.80 },
    { nom: 'Algérienne', prix: 0.80 }
  ];

  const snacks = [
    { nom: 'Fricadelle', prix: 1.50 },
    { nom: 'Fricadelle spéciale', prix: 2.50 },
    { nom: 'Cervelas', prix: 2.50 },
    { nom: 'Cervelas spécial', prix: 3.50 },
    { nom: 'Viandelle', prix: 2.40 },
    { nom: 'Viandelle spéciale', prix: 3.40 },
    { nom: 'Hamburger (la viande)', prix: 2.00 },
    { nom: 'Mexicanos', prix: 2.80 },
    { nom: 'Poulycroc', prix: 2.60 },
    { nom: 'Poulycroc fromage', prix: 3.00 },
    { nom: 'Brochette oignons-poivrons', prix: 4.00 },
    { nom: 'Brochette de dinde', prix: 4.20 },
    { nom: 'Brochette gridy', prix: 4.30 },
    { nom: 'Brochette tzigane', prix: 3.60 },
    { nom: 'Brochette pilon', prix: 4.60 },
    { nom: 'Brochette ardennaise', prix: 3.70 },
    { nom: 'Croquette de fromage', prix: 3.00 },
    { nom: 'Croquette de volaille', prix: 2.80 },
    { nom: 'Lucifer', prix: 2.80 },
    { nom: 'Boulet (lapin, provençal, tomate)', prix: 2.80 },
    { nom: 'Boulet rôti', prix: 1.80 },
    { nom: 'Chivfingers', prix: 3.80 },
    { nom: 'Nuggizz', prix: 3.90 },
    { nom: 'Loempla', prix: 4.50 },
    { nom: 'Saucisse géante', prix: 3.00 },
    { nom: 'Ragouzi', prix: 2.90 },
    { nom: 'Mini beemkla', prix: 4.00 },
    { nom: 'Cheese craque', prix: 3.00 }
  ];

  const ajouterCommande = (e) => {
    e.preventDefault();
    if (nouveauNom.trim() === '') return;

    const friteObj = taillesFrites.find(f => f.nom === nouvelleFrite);
    const totalFrite = friteObj ? friteObj.prix : 0;
    const totalSauces = nouvellesSauces.reduce((sum, s) => sum + s.prix, 0);
    const totalSnacks = nouveauxSnacks.reduce((sum, s) => sum + s.prix, 0);
    const total = totalFrite + totalSauces + totalSnacks;

    const nouvelleCommande = {
      id: Date.now(),
      nom: nouveauNom,
      tailleFrite: nouvelleFrite,
      sauces: nouvellesSauces,
      snacks: nouveauxSnacks,
      total: total
    };

    setCommandes([...commandes, nouvelleCommande]);
    setNouveauNom('');
    setNouvelleFrite('Petite');
    setNouvellesSauces([]);
    setNouveauxSnacks([]);
  };

  const supprimerCommande = (id) => {
    setCommandes(commandes.filter(cmd => cmd.id !== id));
  };

  const toggleSauce = (sauce) => {
    if (nouvellesSauces.find(s => s.nom === sauce.nom)) {
      setNouvellesSauces(nouvellesSauces.filter(s => s.nom !== sauce.nom));
    } else {
      setNouvellesSauces([...nouvellesSauces, sauce]);
    }
  };

  const toggleSnack = (snack) => {
    if (nouveauxSnacks.find(s => s.nom === snack.nom)) {
      setNouveauxSnacks(nouveauxSnacks.filter(s => s.nom !== snack.nom));
    } else {
      setNouveauxSnacks([...nouveauxSnacks, snack]);
    }
  };

  const genererEmail = () => {
    let texteCommande = 'Bonjour,\n\nVoici notre commande :\n\n';
    let totalGeneral = 0;

    commandes.forEach(cmd => {
      texteCommande += `${cmd.nom} :\n`;
      texteCommande += `  - Frites ${cmd.tailleFrite}\n`;

      if (cmd.snacks && cmd.snacks.length > 0) {
        texteCommande += `  - Snacks : ${cmd.snacks.map(s => s.nom).join(', ')}\n`;
      }

      if (cmd.sauces && cmd.sauces.length > 0) {
        texteCommande += `  - Sauces : ${cmd.sauces.map(s => s.nom).join(', ')}\n`;
      }

      texteCommande += `  Total : ${cmd.total.toFixed(2)}€\n\n`;
      totalGeneral += cmd.total;
    });

    texteCommande += `TOTAL GÉNÉRAL : ${totalGeneral.toFixed(2)}€\n\n`;
    texteCommande += 'Merci et à bientôt !\n\nL\'équipe AIDE';

    const mailtoLink = `mailto:lecoin.croquant@example.com?subject=Commande de frites - Mercredi&body=${encodeURIComponent(texteCommande)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <img src={`${process.env.PUBLIC_URL}/AIDE_logo_Col.png`} alt="AIDE Logo" className="aide-logo" />
          Commande Friterie
        </h1>
        <p className="subtitle">Le Coin Croquant - Ougrée</p>
      </header>

      <div className="container">
        <div className="form-section">
          <h2>Ajouter une commande</h2>
          <form onSubmit={ajouterCommande}>
            <div className="form-group">
              <label>Nom :</label>
              <input
                type="text"
                value={nouveauNom}
                onChange={(e) => setNouveauNom(e.target.value)}
                placeholder="Entrez votre nom"
                required
              />
            </div>

            <div className="form-group">
              <label>Taille des frites :</label>
              <select
                value={nouvelleFrite}
                onChange={(e) => setNouvelleFrite(e.target.value)}
              >
                {taillesFrites.map(taille => (
                  <option key={taille.nom} value={taille.nom}>
                    {taille.nom} - {taille.prix.toFixed(2)}€
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Snacks (optionnel) :</label>
              <div className="sauces-grid">
                {snacks.map(snack => (
                  <label key={snack.nom} className="sauce-checkbox">
                    <input
                      type="checkbox"
                      checked={nouveauxSnacks.find(s => s.nom === snack.nom)}
                      onChange={() => toggleSnack(snack)}
                    />
                    {snack.nom} ({snack.prix.toFixed(2)}€)
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Sauces (optionnel) :</label>
              <div className="sauces-grid">
                {sauces.map(sauce => (
                  <label key={sauce.nom} className="sauce-checkbox">
                    <input
                      type="checkbox"
                      checked={nouvellesSauces.find(s => s.nom === sauce.nom)}
                      onChange={() => toggleSauce(sauce)}
                    />
                    {sauce.nom} ({sauce.prix.toFixed(2)}€)
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Ajouter la commande
            </button>
          </form>
        </div>

        <div className="commandes-section">
          <h2>Commandes ({commandes.length})</h2>

          {commandes.length === 0 ? (
            <p className="empty-message">Aucune commande pour le moment</p>
          ) : (
            <>
              <div className="commandes-list">
                {commandes.map(cmd => (
                  <div key={cmd.id} className="commande-item">
                    <div className="commande-info">
                      <strong>{cmd.nom}</strong>
                      <div className="commande-details">
                        Frites {cmd.tailleFrite}
                        {cmd.snacks && cmd.snacks.length > 0 && (
                          <span className="snacks-text"> + {cmd.snacks.map(s => s.nom).join(', ')}</span>
                        )}
                        {cmd.sauces && cmd.sauces.length > 0 && (
                          <span className="sauces-text"> + {cmd.sauces.map(s => s.nom).join(', ')}</span>
                        )}
                      </div>
                      <div className="commande-total">Total : {cmd.total.toFixed(2)}€</div>
                    </div>
                    <button
                      onClick={() => supprimerCommande(cmd.id)}
                      className="btn-delete"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={genererEmail}
                className="btn-email"
                disabled={commandes.length === 0}
              >
                📧 Générer l'email de commande
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
