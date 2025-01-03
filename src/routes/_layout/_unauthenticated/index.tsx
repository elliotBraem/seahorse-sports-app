import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/_unauthenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(landing)/"!</div>
}
