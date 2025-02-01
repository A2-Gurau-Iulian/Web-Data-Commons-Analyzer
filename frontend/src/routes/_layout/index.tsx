import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})

function Home() {
  return <div>Web data common analyzer is a web app for visualizing and analyzing web data</div>
}
