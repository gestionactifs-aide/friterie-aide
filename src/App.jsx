import { useState, useEffect } from 'react';
import './App.css';
import { database } from './firebase';
import { ref, onValue, push, remove, set } from 'firebase/database';

function App() {
  const [commandes, setCommandes] = useState([]);
  const [nouveauNom, setNouveauNom] = useState('');
  const [nouvelleFrite, setNouvelleFrite] = useState('Aucune');
  const [nouvellesSauces, setNouvellesSauces] = useState([]);
  const [nouveauxSnacks, setNouveauxSnacks] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [taillesFrites, setTaillesFrites] = useState([]);
  const [sauces, setSauces] = useState([]);
  const [snacks, setSnacks] = useState([]);
  
  const initializePrices = () => {
    const defaultFrites = [
      { nom: 'Mini', prix: 2.00 },
      { nom: 'Petite', prix: 2.50 },
      { nom: 'Moyenne', prix: 3.00 },
      { nom: 'Grande', prix: 3.50 },
      { nom: 'Spéciale +1,50€', prix: 4.50 }
    ];

    const defaultSauces = [
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

    const defaultSnacks = [
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

    set(ref(database, 'menu/frites'), defaultFrites);
    set(ref(database, 'menu/sauces'), defaultSauces);
    set(ref(database, 'menu/snacks'), defaultSnacks);
  };

  // Synchronisation Firebase - avec conversion objet -> tableau
  // CORRECTION: Les commandes sont stockées avec des clés Firebase individuelles
  useEffect(() => {
    const commandesRef = ref(database, 'commandes');
    const unsubscribe = onValue(commandesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convertir l'objet Firebase en tableau avec les IDs
        const commandesArray = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key // L'ID est maintenant la clé Firebase
        }));
        setCommandes(commandesArray);
      } else {
        setCommandes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Bouton admin pour effacer toutes les commandes
  const effacerToutesCommandes = () => {
    if (window.confirm('Effacer toutes les commandes ?')) {
      remove(ref(database, 'commandes'));
    }
  };

  // Synchronisation des prix du menu avec cleanup
  useEffect(() => {
    const fritesRef = ref(database, 'menu/frites');
    const saucesRef = ref(database, 'menu/sauces');
    const snacksRef = ref(database, 'menu/snacks');

    const unsubFrites = onValue(fritesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        initializePrices();
      } else {
        setTaillesFrites(data);
      }
    });

    const unsubSauces = onValue(saucesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSauces(data);
    });

    const unsubSnacks = onValue(snacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSnacks(data);
    });

    // Cleanup: se désabonner des listeners
    return () => {
      unsubFrites();
      unsubSauces();
      unsubSnacks();
    };
  }, []);

  // CORRECTION: Utiliser push() au lieu de set() pour éviter les race conditions
  const ajouterCommande = (e) => {
    e.preventDefault();
    if (nouveauNom.trim() === '') return;

    if (nouvelleFrite === 'Aucune' && nouveauxSnacks.length === 0) {
      alert('Veuillez sélectionner au moins des frites ou un snack');
      return;
    }

    const friteObj = taillesFrites.find(f => f.nom === nouvelleFrite);
    const totalFrite = (friteObj && nouvelleFrite !== 'Aucune') ? friteObj.prix : 0;
    const totalSauces = nouvellesSauces.reduce((sum, s) => sum + s.prix, 0);
    const totalSnacks = nouveauxSnacks.reduce((sum, s) => sum + s.prix, 0);
    const total = totalFrite + totalSauces + totalSnacks;

    const nouvelleCommande = {
      timestamp: Date.now(),
      nom: nouveauNom,
      tailleFrite: nouvelleFrite,
      sauces: nouvellesSauces,
      snacks: nouveauxSnacks,
      total: total
    };

    // CORRECTION: push() crée une clé unique pour chaque commande
    // Pas de lecture de l'état local = pas de race condition
    const commandesRef = ref(database, 'commandes');
    push(commandesRef, nouvelleCommande);

    setNouveauNom('');
    setNouvelleFrite('Aucune');
    setNouvellesSauces([]);
    setNouveauxSnacks([]);
  };

  // CORRECTION: Utiliser remove() avec la clé Firebase
  const supprimerCommande = (id) => {
    remove(ref(database, `commandes/${id}`));
  };

  const toggleSauce = (sauce) => {
    if (nouvellesSauces.find(s => s.nom === sauce.nom)) {
      setNouvellesSauces(nouvellesSauces.filter(s => s.nom !== sauce.nom));
    } else {
      setNouvellesSauces([...nouvellesSauces, sauce]);
    }
  };

  const ajouterSnack = (snack) => {
    setNouveauxSnacks([...nouveauxSnacks, snack]);
  };

  const retirerSnack = (snack) => {
    const index = nouveauxSnacks.findIndex(s => s.nom === snack.nom);
    if (index !== -1) {
      const updated = [...nouveauxSnacks];
      updated.splice(index, 1);
      setNouveauxSnacks(updated);
    }
  };

  const getSnackQuantite = (snack) => {
    return nouveauxSnacks.filter(s => s.nom === snack.nom).length;
  };

  const genererRecapitulatif = () => {
    const recap = {};
    commandes.forEach(cmd => {
      if (cmd.tailleFrite && cmd.tailleFrite !== 'Aucune') {
        const friteKey = `Frites ${cmd.tailleFrite}`;
        recap[friteKey] = (recap[friteKey] || 0) + 1;
      }
      if (cmd.snacks && cmd.snacks.length > 0) {
        cmd.snacks.forEach(snack => {
          recap[snack.nom] = (recap[snack.nom] || 0) + 1;
        });
      }
      if (cmd.sauces && cmd.sauces.length > 0) {
        cmd.sauces.forEach(sauce => {
          recap[sauce.nom] = (recap[sauce.nom] || 0) + 1;
        });
      }
    });
    return recap;
  };

  const preparerCommande = () => {
    let texteCommande = 'Bonjour,\n\nVoici notre commande :\n\n';
    let totalGeneral = 0;

    const recap = genererRecapitulatif();
    texteCommande += '=== RÉCAPITULATIF ===\n';
    Object.entries(recap).forEach(([item, quantite]) => {
      texteCommande += `${quantite}x ${item}\n`;
    });
    texteCommande += '\n=== DÉTAIL PAR PERSONNE ===\n\n';

    commandes.forEach(cmd => {
      texteCommande += `${cmd.nom} :\n`;
      if (cmd.tailleFrite && cmd.tailleFrite !== 'Aucune') {
        texteCommande += `  - Frites ${cmd.tailleFrite}\n`;
      }
      if (cmd.snacks && cmd.snacks.length > 0) {
        const snacksGroupes = {};
        cmd.snacks.forEach(s => {
          snacksGroupes[s.nom] = (snacksGroupes[s.nom] || 0) + 1;
        });
        const snacksTexte = Object.entries(snacksGroupes)
          .map(([nom, qty]) => qty > 1 ? `${qty}x ${nom}` : nom)
          .join(', ');
        texteCommande += `  - Snacks : ${snacksTexte}\n`;
      }
      if (cmd.sauces && cmd.sauces.length > 0) {
        texteCommande += `  - Sauces : ${cmd.sauces.map(s => s.nom).join(', ')}\n`;
      }
      texteCommande += `  Total : ${cmd.total.toFixed(2)}€\n\n`;
      totalGeneral += cmd.total;
    });

    texteCommande += `TOTAL GÉNÉRAL : ${totalGeneral.toFixed(2)}€\n\n`;
    texteCommande += "Merci et à bientôt !\n\nL'équipe AIDE";

    return { texte: texteCommande, total: totalGeneral };
  };

  const copierCommande = () => {
    const { texte } = preparerCommande();
    navigator.clipboard.writeText(texte).then(() => {
      alert('Commande copiée !');
    });
  };

  const appelFriterie = () => {
    window.location.href = 'tel:+3243368999';
  };

  const ouvrirGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/wcfUEgohFHk8FALh9', '_blank');
  };

  const ouvrirFacebook = () => {
    window.open('https://www.facebook.com/y.fernandez.y/photos', '_blank');
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'AIDE2025') {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const updatePrice = (category, index, newPrice) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;

    if (category === 'frites') {
      const updated = [...taillesFrites];
      updated[index].prix = price;
      set(ref(database, 'menu/frites'), updated);
    } else if (category === 'sauces') {
      const updated = [...sauces];
      updated[index].prix = price;
      set(ref(database, 'menu/sauces'), updated);
    } else if (category === 'snacks') {
      const updated = [...snacks];
      updated[index].prix = price;
      set(ref(database, 'menu/snacks'), updated);
    }
  };

  const updateName = (category, index, newName) => {
    if (!newName || newName.trim() === '') return;

    if (category === 'frites') {
      const updated = [...taillesFrites];
      updated[index].nom = newName.trim();
      set(ref(database, 'menu/frites'), updated);
    } else if (category === 'sauces') {
      const updated = [...sauces];
      updated[index].nom = newName.trim();
      set(ref(database, 'menu/sauces'), updated);
    } else if (category === 'snacks') {
      const updated = [...snacks];
      updated[index].nom = newName.trim();
      set(ref(database, 'menu/snacks'), updated);
    }
  };

  return (
    <div className="App">
      <div className="update-banner">
        <span>Mise à jour v2.0 : Les commandes ne disparaissent plus !</span>
      </div>
      <header className="App-header">
        <h1>
          <img
            src={import.meta.env.BASE_URL + "AIDE_logo_Col.png"}
            alt="AIDE Logo"
            className="aide-logo"
            onClick={() => setShowAdmin(!showAdmin)}
            style={{ cursor: 'pointer' }}
            title="Cliquez pour l'administration"
          />
          Commande Friterie
        </h1>
      </header>

      {showAdmin && (
        <div className="admin-modal">
          <div className="admin-content">
            <button className="close-admin" onClick={() => setShowAdmin(false)}>X</button>

            {!isAdminAuthenticated ? (
              <div className="admin-login">
                <h2>Administration</h2>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <button onClick={handleAdminLogin} className="btn-primary">Se connecter</button>
              </div>
            ) : (
              <div className="admin-prices">
                <h2>Administration</h2>

                <button
                  onClick={effacerToutesCommandes}
                  className="btn-danger"
                  style={{marginBottom: '20px', width: '100%', padding: '15px', fontSize: '16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
                >
                  EFFACER TOUTES LES COMMANDES
                </button>

                <h3>Frites</h3>
                {taillesFrites.map((item, index) => (
                  <div key={index} className="price-item-full">
                    <input type="text" className="admin-name-input" value={item.nom} onChange={(e) => updateName('frites', index, e.target.value)} placeholder="Nom" />
                    <input type="number" className="admin-price-input" step="0.10" value={item.prix} onChange={(e) => updatePrice('frites', index, e.target.value)} />
                    <span>€</span>
                  </div>
                ))}

                <h3>Sauces</h3>
                {sauces.map((item, index) => (
                  <div key={index} className="price-item-full">
                    <input type="text" className="admin-name-input" value={item.nom} onChange={(e) => updateName('sauces', index, e.target.value)} placeholder="Nom" />
                    <input type="number" className="admin-price-input" step="0.10" value={item.prix} onChange={(e) => updatePrice('sauces', index, e.target.value)} />
                    <span>€</span>
                  </div>
                ))}

                <h3>Snacks</h3>
                <div className="snacks-grid-admin">
                  {snacks.map((item, index) => (
                    <div key={index} className="price-item-full">
                      <input type="text" className="admin-name-input" value={item.nom} onChange={(e) => updateName('snacks', index, e.target.value)} placeholder="Nom" />
                      <input type="number" className="admin-price-input" step="0.10" value={item.prix} onChange={(e) => updatePrice('snacks', index, e.target.value)} />
                      <span>€</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => { setIsAdminAuthenticated(false); setShowAdmin(false); }} className="btn-primary" style={{marginTop: '20px'}}>Fermer</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container">
        <div className="form-section">
          <h2>Ajouter une commande</h2>
          <form onSubmit={ajouterCommande}>
            <div className="form-group">
              <label>Nom :</label>
              <input type="text" value={nouveauNom} onChange={(e) => setNouveauNom(e.target.value)} placeholder="Entrez votre nom" required />
            </div>

            <div className="form-group">
              <label>Taille des frites (optionnel) :</label>
              <select value={nouvelleFrite} onChange={(e) => setNouvelleFrite(e.target.value)}>
                <option value="Aucune">Aucune - 0.00€</option>
                {taillesFrites.map(taille => (
                  <option key={taille.nom} value={taille.nom}>{taille.nom} - {taille.prix.toFixed(2)}€</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Snacks (optionnel) :</label>
              <div className="snacks-counter-grid">
                {snacks.map(snack => {
                  const quantite = getSnackQuantite(snack);
                  return (
                    <div key={snack.nom} className="snack-counter">
                      <span className="snack-name">{snack.nom} ({snack.prix.toFixed(2)}€)</span>
                      <div className="counter-controls">
                        <button type="button" onClick={() => retirerSnack(snack)} disabled={quantite === 0} className="btn-counter">-</button>
                        <span className="counter-value">{quantite}</span>
                        <button type="button" onClick={() => ajouterSnack(snack)} className="btn-counter">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label>Sauces (optionnel) :</label>
              <div className="sauces-grid">
                {sauces.map(sauce => (
                  <label key={sauce.nom} className="sauce-checkbox">
                    <input type="checkbox" checked={!!nouvellesSauces.find(s => s.nom === sauce.nom)} onChange={() => toggleSauce(sauce)} />
                    {sauce.nom} ({sauce.prix.toFixed(2)}€)
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary">Ajouter la commande</button>
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
                        {cmd.tailleFrite && cmd.tailleFrite !== 'Aucune' && (<span>Frites {cmd.tailleFrite}</span>)}
                        {cmd.snacks && cmd.snacks.length > 0 && (
                          <span className="snacks-text">
                            {cmd.tailleFrite && cmd.tailleFrite !== 'Aucune' ? ' + ' : ''}
                            {(() => {
                              const snacksGroupes = {};
                              cmd.snacks.forEach(s => { snacksGroupes[s.nom] = (snacksGroupes[s.nom] || 0) + 1; });
                              return Object.entries(snacksGroupes).map(([nom, qty]) => qty > 1 ? `${qty}x ${nom}` : nom).join(', ');
                            })()}
                          </span>
                        )}
                        {cmd.sauces && cmd.sauces.length > 0 && (<span className="sauces-text"> + {cmd.sauces.map(s => s.nom).join(', ')}</span>)}
                      </div>
                      <div className="commande-total">Total : {cmd.total.toFixed(2)}€</div>
                    </div>
                    <button onClick={() => supprimerCommande(cmd.id)} className="btn-delete" disabled={!isAdminAuthenticated} title={isAdminAuthenticated ? "Supprimer cette commande" : "Seul l'administrateur peut supprimer"}>X</button>
                  </div>
                ))}
              </div>

              <div className="total-general">
                <strong>TOTAL GÉNÉRAL : </strong>
                <span className="montant-total">{commandes.reduce((sum, cmd) => sum + cmd.total, 0).toFixed(2)}€</span>
              </div>

              <div className="actions-buttons">
                <button onClick={copierCommande} className="btn-action btn-copier" disabled={commandes.length === 0}>Copier la commande</button>
                <button onClick={appelFriterie} className="btn-action btn-telephone">Appeler 04 336 89 99</button>
                <button onClick={ouvrirGoogleMaps} className="btn-action btn-maps">Voir l'itinéraire</button>
                <button onClick={ouvrirFacebook} className="btn-action btn-facebook">Page Facebook</button>
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
