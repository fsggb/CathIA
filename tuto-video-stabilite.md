# Tutoriel vidéo CathIA : assembler, vérifier la stabilité, modifier après coup

Durée visée : 4 min 30. Format 16:9, 1920 × 1080, interface CathIA en clair, voix off + sous-titres.
Préparation : vider le projet (Fichier > Nouveau), zoom de l'interface à 100 %, curseur agrandi.

| # | Durée | À l'écran | Voix off (texte à lire) |
|---|---|---|---|
| 1 | 0:00–0:15 | Logo CathIA, puis l'établi de la bibliothèque qui tourne | « Dans ce tutoriel, on assemble des perches, on vérifie que le meuble tient, et on modifie une pièce sans tout refaire. » |
| 2 | 0:15–0:45 | Créer > Traverse, deux fois ; poser une traverse au sol et une verticale | « On crée deux traverses. Pour en incliner une, on la fait tourner : elle pivote autour de son pied, et CathIA affiche son inclinaison par rapport à la verticale et au sol. » (montrer l'info « inclinée de 15° ») |
| 3 | 0:45–1:30 | Sélectionner les deux pièces > Façonner et assembler > Mi-bois | « On choisit un mi-bois. L'aperçu se met à jour pendant qu'on règle l'entaille. En bas de la fenêtre, le texte rappelle ce que bloque l'assemblage : un mi-bois seul laisse les pièces se décoller. On choisit donc « chevillé ». » Zoom sur le bouton **Créer**, toujours visible en bas. |
| 4 | 1:30–2:00 | Ajouter une troisième perche, l'assembler par un tenon à la première | « Un tenon rond : la pièce peut encore tourner dans sa mortaise. Une cheville à travers le tenon bloque cette rotation. » |
| 5 | 2:00–2:45 | Contrôle > **Stabilité** ; la fenêtre affiche « 1 mobilité restante », la pièce mobile est sélectionnée | « Le bouton Stabilité calcule en quelques millisecondes les degrés de liberté de toute la structure. Ici, il reste une mobilité : la pièce sélectionnée peut encore tourner. » |
| 6 | 2:45–3:10 | Ajouter une cheville ; relancer Stabilité : « rigide » | « On ajoute une cheville… et la structure devient rigide. » |
| 7 | 3:10–3:40 | Brêlage entre deux perches qui se croisent ; déplacer l'une : l'autre suit | « Le brêlage relie maintenant vraiment les pièces : quand on en déplace une, l'autre suit. Seul, un brêlage laisse tourner les perches l'une sur l'autre : en triangle, il tient. » |
| 8 | 3:40–4:15 | Allonger la première traverse avec la poignée ; le mi-bois et le tenon se recalculent | « On peut revenir sur n'importe quelle pièce ou assemblage : on allonge la traverse, et les assemblages qui la touchent sont refaits à la bonne place. Même chose si on rouvre un assemblage pour changer sa profondeur. » |
| 9 | 4:15–4:30 | Bibliothèque > Établi > Stabilité : « seule la pédale bouge » | « Sur l'établi de la bibliothèque, seule la pédale reste mobile : c'est voulu, c'est son articulation. À vous de jouer ! » |

## Ce que bloque chaque assemblage (pour les sous-titres ou une image fixe)

| Assemblage | Degrés bloqués | Reste libre |
|---|---|---|
| Tenon rond | 4 | rotation autour du tenon, retrait du tenon (tenu par le serrage) |
| Tenon plat | 5 | retrait du tenon |
| Queue d'aronde | 5 | glissement dans l'entaille |
| Mi-bois | 5 | décollement des deux pièces |
| Mi-bois chevillé | 6 | rien |
| Cheville | 5 | rotation autour de la cheville (serrée, elle empêche aussi l'arrachement) |
| Brêlage | 5 | rotation d'une perche sur l'autre (d'où le triangle) |

Choix retenu pour la cheville : **5 degrés bloqués** (les deux pièces ne peuvent plus se séparer le long de la
cheville, qui est serrée ; seule la rotation autour d'elle reste). Le calcul de stabilité ne compte pas les
démontages (retirer un tenon, décoller un mi-bois) ni la rotation d'une perche ronde sur elle-même, qui ne
déforment pas le meuble.

## Tournage
- Enregistrer chaque plan séparément (OBS, 30 i/s), puis monter ; pas de musique sous la voix.
- Captures à reprendre si l'interface change : plans 3, 5 et 8.
