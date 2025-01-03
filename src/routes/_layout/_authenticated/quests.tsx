import { createFileRoute } from '@tanstack/react-router'
import { Quest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Twitter } from 'lucide-react'

const QUESTS: Quest[] = [
  {
    id: '1',
    title: 'Share Your Fan Story',
    description: 'Post about your favorite Super Bowl memory on X',
    points: 100,
    status: 'active',
    type: 'twitter',
    twitterIntent: {
      text: 'My favorite Super Bowl memory is...',
      hashtags: ['SuperBowl'],
      via: 'test_curation',
    },
  },
  {
    id: '2',
    title: 'Coming Soon',
    description: 'More challenges await!',
    points: 200,
    status: 'locked',
    type: 'other',
  },
]

export const Route = createFileRoute('/_layout/_authenticated/quests')({
  component: Quests,
})

function Quests() {
  const handleTwitterShare = (quest: Quest) => {
    if (quest.twitterIntent) {
      const { text, hashtags, via } = quest.twitterIntent
      const url = new URL('https://twitter.com/intent/tweet')
      url.searchParams.set('text', text)
      url.searchParams.set('hashtags', hashtags.join(','))
      if (via) url.searchParams.set('via', via)
      window.open(url.toString(), '_blank')
    }
  }

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Quests</h1>
        <p className="text-muted-foreground">
          Complete quests to win Super Bowl tickets!
        </p>
      </div>

      <div className="grid gap-6 w-full">
        {QUESTS.map((quest) => (
          <Card
            key={quest.id}
            className={quest.status === 'locked' ? 'opacity-50' : ''}
          >
            <CardHeader>
              <CardTitle>{quest.title}</CardTitle>
              <CardDescription>{quest.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {quest.points} points
                </span>
                {quest.type === 'twitter' && quest.status === 'active' && (
                  <Button onClick={() => handleTwitterShare(quest)}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on X
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
