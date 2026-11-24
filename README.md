# Lucioles

Un casse-tête de lumières dans un pré la nuit : toucher une luciole l'allume ou l'éteint, elle et ses quatre voisines. Allume-les toutes, en le moins de coups possible.

*English version: [README.en.md](README.en.md)*

## Pré du jour et solution expliquée (nouveau en 1.2.0)

**Pré du jour** : un pré le même pour tout le monde chaque jour, avec une série de jours. **La solution expliquée** : le jeu est un problème d’algèbre. Toucher deux fois une luciole ne change rien, donc seul compte « touchée ou pas » (0 ou 1, avec 1 + 1 = 0) ; chaque luciole donne une équation, et le jeu résout ces 25 équations par élimination. Il explique le calcul (combien d’équations vraiment différentes, combien de solutions) et marque sur le pré les cases de la solution la plus courte.

## Comment jouer

- Le pré est une grille de 5 × 5 lucioles, certaines allumées, d'autres éteintes.
- **Clique une luciole** : elle s'inverse (allumée ↔ éteinte), ainsi que celles juste **au-dessus, au-dessous, à gauche et à droite**. Sur les bords et dans les coins, il y a moins de voisines.
- Le pré est fini quand **toutes les lucioles sont allumées**.

Astuce : l'ordre des touches ne compte pas, et toucher deux fois la même luciole revient à ne rien faire.

- **Plein écran** : le bouton du même nom ; Échap pour en sortir. Hors plein écran, le pré prend toute la place que laisse la fenêtre.
- Une luciole éteinte est posée sur sa tige, ailes repliées ; allumée, elle **décolle**, bat des ailes et volette en petites boucles, l'abdomen brillant.

## Les prés

- Chaque pré est fabriqué en partant d'un pré tout allumé et en touchant quelques lucioles : il est donc **toujours faisable**, et le jeu connaît le nombre de coups qu'il lui a fallu.
- Le pré 1 se fait en 3 coups ; chaque pré suivant en demande un de plus, jusqu'à 12.
- Un pré réussi ouvre le suivant ; **◀ ▶** reviennent aux prés déjà atteints.

## Étoiles

En haut, le compteur montre tes coups et ceux du jeu. **Trois étoiles** si tu finis en autant de coups que le jeu ou moins, deux jusqu'à 3 coups de plus, une au-delà.

## Statistiques

Le panneau Records montre le **pré le plus loin** atteint, le total d'**étoiles** et le nombre de **prés finis**.

## Données et synchronisation

Ton avancée et tes étoiles sont enregistrées par NeoDex, sauvegardées et synchronisées entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Lucioles → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
