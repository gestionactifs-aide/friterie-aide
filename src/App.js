import React, { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase';
import { ref, onValue, set } from 'firebase/database';

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
    { nom: 'Spéciale +1,50€', prix: 4.50 }
  ];

  const sauces = [
    { nom: 'Ketchup', prix: 0.90 },
    { nom: 'Tartare', prix: 0.90 },
    { nom: 'Mayonnaise', prix: 0.90 },
    { nom: 'Andalouse', prix: 0.90 },
    { nom: 'Cocktail', prix: 0.90 },
    { nom: 'Américaine du chef', prix: 0.90 },
    { nom: 'Samourai', prix: 0.90 },
    { nom: 'Aïoli', prix: 0.90 },
    { nom: 'Brazil', prix: 0.90 },
    { nom: 'Biche', prix: 0.90 },
    { nom: 'Ketchup curry', prix: 0.90 },
    { nom: 'Toscane', prix: 0.90 },
    { nom: 'Moutarde', prix: 0.90 },
    { nom: 'Béarnaise', prix: 0.90 },
    { nom: 'Autre doux', prix: 0.90 },
    { nom: 'Algérienne', prix: 0.90 }
  ];

  const snacks = [
    { nom: 'Fricadelle', prix: 1.50 },
    { nom: 'Fricadelle spéciale', prix: 2.50 },
    { nom: 'Fricadelle xxl', prix: 4.50 },
    { nom: 'Fricadelle xxl spéciale', prix: 5.50 },
    { nom: 'Cervelas', prix: 2.50 },
    { nom: 'Cervelas spécial', prix: 3.50 },
    { nom: 'Viandelle', prix: 2.40 },
    { nom: 'Viandelle spéciale', prix: 3.40 },
    { nom: 'Viandelle xl', prix: 4.00 },
    { nom: 'Hamburger (la viande)', prix: 2.00 },
    { nom: 'Mexicanos', prix: 2.80 },
    { nom: 'Poulycroc', prix: 2.60 },
    { nom: 'Poulycroc fromage', prix: 3.00 },
    { nom: 'Brochette oignons-poivrons', prix: 4.00 },
    { nom: 'Brochette de dinde', prix: 4.20 },
    { nom: 'Brochette grizly', prix: 4.30 },
    { nom: 'Brochette tzigane', prix: 3.60 },
    { nom: 'Brochette pilon', prix: 4.60 },
    { nom: 'Brochette ardennaise', prix: 3.70 },
    { nom: 'Brochette de poisson', prix: 4.80 },
    { nom: 'Croquette de fromage', prix: 3.00 },
    { nom: 'Croquette de volaille', prix: 2.80 },
    { nom: 'Lucifer', prix: 2.90 },
    { nom: 'Mini lucifer', prix: 4.00 },
    { nom: 'Boulet (lapin, provençal, tomate)', prix: 2.80 },
    { nom: 'Boulet rôti', prix: 1.80 },
    { nom: 'Chixfingers', prix: 3.90 },
    { nom: 'Nuggizz', prix: 3.90 },
    { nom: 'Mini loempia', prix: 4.00 },
    { nom: 'Loempidel', prix: 3.00 },
    { nom: 'Mini classics', prix: 4.80 },
    { nom: 'Saucisse géante', prix: 3.00 },
    { nom: 'Ragouzi', prix: 2.90 },
    { nom: 'Cheese craque', prix: 3.00 },
    { nom: 'Taco', prix: 3.90 }
  ];

  // Synchronisation avec Firebase
  useEffect(() => {
    const today = new Date().toDateString();
    const commandesRef = ref(database, 'commandes');
    const dateRef = ref(database, 'lastDate');

    // Vérifier la date et réinitialiser si nécessaire
    onValue(dateRef, (snapshot) => {
      const lastDate = snapshot.val();
      if (lastDate !== today) {
        // Nouveau jour : réinitialiser les commandes
        set(dateRef, today);
        set(commandesRef, []);
      }
    });

    // Écouter les changements des commandes en temps réel
    const unsubscribe = onValue(commandesRef, (snapshot) => {
      const data = snapshot.val();
      setCommandes(data || []);
    });

    return () => unsubscribe();
  }, []);

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

    // Sauvegarder dans Firebase
    const commandesRef = ref(database, 'commandes');
    const nouvellesCommandes = [...commandes, nouvelleCommande];
    set(commandesRef, nouvellesCommandes);

    setNouveauNom('');
    setNouvelleFrite('Petite');
    setNouvellesSauces([]);
    setNouveauxSnacks([]);
  };

  const supprimerCommande = (id) => {
    // Supprimer de Firebase
    const commandesRef = ref(database, 'commandes');
    const nouvellesCommandes = commandes.filter(cmd => cmd.id !== id);
    set(commandesRef, nouvellesCommandes);
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

  const preparerCommande = () => {
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

    return { texte: texteCommande, total: totalGeneral };
  };

  const copierCommande = () => {
    const { texte } = preparerCommande();
    navigator.clipboard.writeText(texte).then(() => {
      alert('📋 Commande copiée dans le presse-papier!');
    });
  };

  const appelFriterie = () => {
    window.location.href = 'tel:+3243368999';
  };

  const ouvrirGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/wcfUEgohFHk8FALh9', '_blank');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <img src={`${process.env.PUBLIC_URL}/AIDE_logo_Col.png`} alt="AIDE Logo" className="aide-logo" />
          Commande Friterie
        </h1>
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
          <h2>Commandes ({commandes.length}) - {new Date().toLocaleDateString('fr-BE')}</h2>

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

              <div className="total-general">
                <strong>TOTAL GÉNÉRAL : </strong>
                <span className="montant-total">
                  {commandes.reduce((sum, cmd) => sum + cmd.total, 0).toFixed(2)}€
                </span>
              </div>

              <div className="actions-buttons">
                <button
                  onClick={copierCommande}
                  className="btn-action btn-copier"
                  disabled={commandes.length === 0}
                >
                  📋 Copier la commande
                </button>

                <button
                  onClick={appelFriterie}
                  className="btn-action btn-telephone"
                >
                  📞 Appeler 04 336 89 99
                </button>

                <button
                  onClick={ouvrirGoogleMaps}
                  className="btn-action btn-maps"
                >
                  🗺️ Voir l'itinéraire
                </button>
              </div>

              <div className="friterie-info">
                <p><strong>Le Coin Croquant</strong></p>
                <p>Rue de Boncelles 179, 4102 Ougrée</p>
                <p>Tél: 04 336 89 99</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
