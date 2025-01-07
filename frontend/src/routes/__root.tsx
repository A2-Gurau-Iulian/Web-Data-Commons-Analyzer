import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// Create the root route, this is rendered first when the page is accessed
export const Route = createRootRoute({
  component: () => (
    <>
      <h1>Hello</h1>
      <Outlet /> {/* This renders the child route components */}
      <TanStackRouterDevtools /> {/* This provides router dev tools for debugging */}
    </>
  ),
})