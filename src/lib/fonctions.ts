export interface FonctionDetail {
  nom: string
  question: string
}

export interface FonctionCategorie {
  categorie: string
  fonctions: FonctionDetail[]
}

export const FONCTIONS_PAR_CATEGORIE: FonctionCategorie[] = [
  {
    categorie: 'Tonus',
    fonctions: [
      {
        nom: 'Tonus postural',
        question: "Ce jeu demande-t-il de maintenir une position du corps ou d'un segment corporel contre la gravité ?",
      },
      {
        nom: "Tonus d'action",
        question: "Ce jeu requiert-il d'ajuster la tension musculaire au moment précis d'une action ?",
      },
    ],
  },
  {
    categorie: 'Équilibre',
    fonctions: [
      {
        nom: 'Équilibre statique',
        question: "Ce jeu oblige-t-il à rester immobile dans une posture stable sans se déplacer ?",
      },
      {
        nom: 'Équilibre dynamique',
        question: "Ce jeu implique-t-il de maintenir son équilibre pendant un déplacement ou un mouvement du corps ?",
      },
    ],
  },
  {
    categorie: 'Schéma corporel & image du corps',
    fonctions: [
      {
        nom: 'Schéma corporel',
        question: "Ce jeu mobilise-t-il la représentation automatique et inconsciente du corps dans l'espace pour guider les gestes ?",
      },
      {
        nom: 'Image du corps',
        question: "Ce jeu invite-t-il le joueur à percevoir, mimer ou représenter son propre corps de façon consciente et subjective ?",
      },
    ],
  },
  {
    categorie: 'Coordinations & dissociations',
    fonctions: [
      {
        nom: 'Coordination dynamique générale',
        question: "Ce jeu demande-t-il de coordonner l'ensemble du corps dans un mouvement global et fluide impliquant plusieurs segments à la fois ?",
      },
      {
        nom: 'Coordination bimanuelle',
        question: "Ce jeu nécessite-t-il d'utiliser les deux mains simultanément, en coopération ou en rôles différenciés ?",
      },
      {
        nom: 'Coordination oculo-motrice',
        question: "Ce jeu exige-t-il une synchronisation précise entre le regard et le geste de la main ?",
      },
      {
        nom: 'Dissociation segmentaire',
        question: "Ce jeu exige-t-il de mobiliser une partie du corps de façon indépendante, sans entraîner les autres segments ?",
      },
    ],
  },
  {
    categorie: 'Motricité globale',
    fonctions: [
      {
        nom: 'Motricité globale (corps entier)',
        question: "Ce jeu engage-t-il le corps entier dans ses actions ?",
      },
    ],
  },
  {
    categorie: 'Motricité fine',
    fonctions: [
      {
        nom: 'Motricité fine manuelle',
        question: "Ce jeu demande-t-il une précision et une dextérité fine des doigts et de la main ?",
      },
      {
        nom: 'Graphomotricité',
        question: "Ce jeu implique-t-il d'écrire, de tracer ou de dessiner à la main comme composante du jeu ?",
      },
    ],
  },
  {
    categorie: 'Praxies',
    fonctions: [
      {
        nom: 'Praxies idéomotrices',
        question: "Ce jeu requiert-il d'exécuter des gestes symboliques ou conventionnels sur consigne ?",
      },
      {
        nom: 'Praxies idéatoires',
        question: "Ce jeu demande-t-il de réaliser une séquence ordonnée de gestes pour manipuler un objet ou accomplir une action complexe ?",
      },
      {
        nom: 'Praxies constructives',
        question: "Ce jeu consiste-t-il à assembler, construire ou reproduire une structure dans l'espace ?",
      },
      {
        nom: 'Praxies visuo-spatiales',
        question: "Ce jeu demande-t-il d'analyser des configurations spatiales visuelles pour les traduire en gestes de placement ou de reproduction précis ?",
      },
      {
        nom: 'Praxies bucco-faciales',
        question: "Ce jeu implique-t-il un contrôle volontaire des muscles du visage, des lèvres ou de la bouche ?",
      },
    ],
  },
  {
    categorie: 'Intégration sensorielle',
    fonctions: [
      {
        nom: 'Intégration proprioceptive',
        question: "Ce jeu sollicite-t-il la perception des positions et tensions articulaires pour réguler ou guider le geste, sans s'appuyer uniquement sur la vision ?",
      },
      {
        nom: 'Intégration vestibulaire',
        question: "Ce jeu mobilise-t-il le sens de l'équilibre et la perception des accélérations ou rotations du corps dans l'espace ?",
      },
    ],
  },
  {
    categorie: 'Espace & temps',
    fonctions: [
      {
        nom: 'Structuration spatiale',
        question: "Ce jeu demande-t-il d'organiser mentalement ou physiquement des éléments dans l'espace en tenant compte de leurs relations ?",
      },
      {
        nom: 'Orientation spatiale',
        question: "Ce jeu nécessite-t-il de se repérer dans un espace de jeu pour décider de ses déplacements ou de ses actions ?",
      },
      {
        nom: 'Orientation droite/gauche',
        question: "Ce jeu requiert-il de distinguer et d'utiliser correctement les notions de droite et de gauche, sur soi ou sur autrui ?",
      },
      {
        nom: 'Structuration temporelle',
        question: "Ce jeu implique-t-il de gérer des notions de durée, de succession ou de simultanéité dans le déroulement des actions ?",
      },
      {
        nom: 'Sens du rythme',
        question: "Ce jeu demande-t-il de percevoir, reproduire ou s'adapter à une structure rythmique régulière ?",
      },
      {
        nom: "Vitesse d'exécution motrice",
        question: "Ce jeu place-t-il le joueur sous contrainte de temps pour réaliser un geste ou une action motrice le plus rapidement possible ?",
      },
    ],
  },
  {
    categorie: 'Fonctions exécutives',
    fonctions: [
      {
        nom: 'Contrôle inhibiteur',
        question: "Ce jeu demande-t-il de résister à une réponse automatique, une impulsion ou une distraction pour agir de façon adaptée aux règles ?",
      },
      {
        nom: 'Mémoire de travail',
        question: "Ce jeu exige-t-il de maintenir et de manipuler activement des informations en mémoire à court terme pendant la partie ?",
      },
      {
        nom: 'Flexibilité cognitive',
        question: "Ce jeu oblige-t-il à changer de stratégie, de point de vue ou de règle en cours de partie pour s'adapter à de nouvelles situations ?",
      },
      {
        nom: 'Planification',
        question: "Ce jeu demande-t-il d'anticiper et d'organiser une séquence d'actions à venir pour atteindre un objectif ?",
      },
      {
        nom: 'Attention',
        question: "Ce jeu nécessite-t-il de maintenir et/ou de diriger son attention de façon soutenue, sélective ou partagée pendant la partie ?",
      },
    ],
  },
]

// Flat list derived from grouped structure
export const FONCTIONS_DETAIL: FonctionDetail[] = FONCTIONS_PAR_CATEGORIE.flatMap(
  (c) => c.fonctions
)