import React, { useState } from 'react';
import './App.css';

function App() {
  const [commandes, setCommandes] = useState([]);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouvelleFrite, setNouvelleFrite] = useState('Petite');
  const [nouvellesSauces, setNouvellesSauces] = useState([]);

  const taillesFrites = ['Petite', 'Moyenne', 'Grande'];
  const sauces = [
    'Ketchup',
    'Mayonnaise',
    'Andalouse',
    'Samourai',
    'Américaine',
    'Tartare',
    'Curry',
    'Poivre',
    'Cocktail',
    'Pita',
    'Hannibal'
  ];

  const ajouterCommande = (e) => {
    e.preventDefault();
    if (nouveauNom.trim() === '') return;

    const nouvelleCommande = {
      id: Date.now(),
      nom: nouveauNom,
      tailleFrite: nouvelleFrite,
      sauces: nouvellesSauces
    };

    setCommandes([...commandes, nouvelleCommande]);
    setNouveauNom('');
    setNouvelleFrite('Petite');
    setNouvellesSauces([]);
  };

  const supprimerCommande = (id) => {
    setCommandes(commandes.filter(cmd => cmd.id !== id));
  };

  const toggleSauce = (sauce) => {
    if (nouvellesSauces.includes(sauce)) {
      setNouvellesSauces(nouvellesSauces.filter(s => s !== sauce));
    } else {
      setNouvellesSauces([...nouvellesSauces, sauce]);
    }
  };

  const genererEmail = () => {
    let texteCommande = 'Bonjour,\n\nVoici notre commande pour ce mercredi :\n\n';

    commandes.forEach(cmd => {
      texteCommande += `${cmd.nom} : Frites ${cmd.tailleFrite}`;
      if (cmd.sauces.length > 0) {
        texteCommande += ` + ${cmd.sauces.join(', ')}`;
      }
      texteCommande += '\n';
    });

    texteCommande += '\nMerci et à bientôt !\n\nL\'équipe AIDE';

    const mailtoLink = `mailto:friterie@example.com?subject=Commande de frites - Mercredi&body=${encodeURIComponent(texteCommande)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🍟 Commande Friterie AIDE</h1>
        <p className="subtitle">Commande du mercredi</p>
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
                  <option key={taille} value={taille}>{taille}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sauces (sélection multiple) :</label>
              <div className="sauces-grid">
                {sauces.map(sauce => (
                  <label key={sauce} className="sauce-checkbox">
                    <input
                      type="checkbox"
                      checked={nouvellesSauces.includes(sauce)}
                      onChange={() => toggleSauce(sauce)}
                    />
                    {sauce}
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
                        {cmd.sauces.length > 0 && (
                          <span className="sauces-text"> + {cmd.sauces.join(', ')}</span>
                        )}
                      </div>
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
