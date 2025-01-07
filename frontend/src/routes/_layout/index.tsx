import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Home,
})

function Home() {
  return <div>Hello "/_layout/home"!</div>
}
