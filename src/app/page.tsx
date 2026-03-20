import Link from 'next/link'
import { Search, Star, NotebookPen, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>

        <div className="container relative py-24 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium mb-8">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Un projet étudiant au service des professionnels
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
              Le bon jeu,{' '}
              <span className="text-accent">au bon moment</span>,<br />
              pour chaque séance.
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
              Un outil créé par des étudiants en psychomotricité pour explorer
              les jeux de société par population, tranche d'âge et fonctions
              psychomotrices.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white gap-2 text-base h-12 px-8"
              >
                <Link href="/jeux">
                  <Search className="h-5 w-5" />
                  Rechercher un jeu
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 text-base h-12 px-8"
              >
                <Link href="/favoris">Mes favoris</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="container py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Qui sommes-nous ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un projet étudiant au service des professionnels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎓',
              title: 'Notre équipe',
              description:
                'Des étudiants en psychomotricité de l\'ISRP Paris, réunis autour d\'un projet extra-académique par passion du métier et des jeux de société.',
            },
            {
              icon: '🎯',
              title: 'Notre objectif',
              description:
                'Répertorier les jeux de société selon leur intérêt psychomoteur et les démocratiser comme outils auprès des professionnels du paramédical.',
            },
            {
              icon: '🔍',
              title: 'Notre approche',
              description:
                'Chaque jeu est annoté par nos soins selon les fonctions psychomotrices et exécutives qu\'il implique, avec l\'âge recommandé et le nombre de joueurs.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
              En trois étapes, trouvez le jeu idéal pour votre séance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                icon: <NotebookPen className="h-6 w-6" />,
                title: 'Définissez vos critères',
                description:
                  'Nombre de joueurs, tranche d\'âge, populations ciblées et fonctions à explorer.',
              },
              {
                number: '02',
                icon: <Search className="h-6 w-6" />,
                title: 'Parcourez les résultats',
                description:
                  'Les jeux correspondant à vos critères s\'affichent avec leurs tags de fonctions et de population.',
              },
              {
                number: '03',
                icon: <Star className="h-6 w-6" />,
                title: 'Sauvegardez vos favoris',
                description:
                  'Enregistrez les jeux qui vous intéressent dans vos favoris pour les retrouver facilement.',
              },
            ].map((step) => (
              <div key={step.number} className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white font-bold">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-accent mb-1">
                    ÉTAPE {step.number}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-primary-foreground/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <BookOpen className="h-12 w-12 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Prêt à enrichir votre pratique ?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Accédez gratuitement à notre catalogue de jeux annotés par nos soins.
          </p>
          <Button asChild size="lg" className="gap-2 text-base h-12 px-10">
            <Link href="/jeux">
              <Search className="h-5 w-5" />
              Accéder au catalogue
            </Link>
          </Button>
        </div>
      </section>

    </>
  )
}
