/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutVisualizeRecordsImport } from './routes/_layout/visualize/records'
import { Route as LayoutVisualizeGraphsImport } from './routes/_layout/visualize/graphs'
import { Route as LayoutVisualizeChartsImport } from './routes/_layout/visualize/charts'
import { Route as LayoutClassifyClassifyImport } from './routes/_layout/classify/classify'
import { Route as LayoutClassifyCategoryDetailsImport } from './routes/_layout/classify/categoryDetails'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutVisualizeRecordsRoute = LayoutVisualizeRecordsImport.update({
  id: '/visualize/records',
  path: '/visualize/records',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutVisualizeGraphsRoute = LayoutVisualizeGraphsImport.update({
  id: '/visualize/graphs',
  path: '/visualize/graphs',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutVisualizeChartsRoute = LayoutVisualizeChartsImport.update({
  id: '/visualize/charts',
  path: '/visualize/charts',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutClassifyClassifyRoute = LayoutClassifyClassifyImport.update({
  id: '/classify/classify',
  path: '/classify/classify',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutClassifyCategoryDetailsRoute =
  LayoutClassifyCategoryDetailsImport.update({
    id: '/classify/categoryDetails',
    path: '/classify/categoryDetails',
    getParentRoute: () => LayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/classify/categoryDetails': {
      id: '/_layout/classify/categoryDetails'
      path: '/classify/categoryDetails'
      fullPath: '/classify/categoryDetails'
      preLoaderRoute: typeof LayoutClassifyCategoryDetailsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/classify/classify': {
      id: '/_layout/classify/classify'
      path: '/classify/classify'
      fullPath: '/classify/classify'
      preLoaderRoute: typeof LayoutClassifyClassifyImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/visualize/charts': {
      id: '/_layout/visualize/charts'
      path: '/visualize/charts'
      fullPath: '/visualize/charts'
      preLoaderRoute: typeof LayoutVisualizeChartsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/visualize/graphs': {
      id: '/_layout/visualize/graphs'
      path: '/visualize/graphs'
      fullPath: '/visualize/graphs'
      preLoaderRoute: typeof LayoutVisualizeGraphsImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/visualize/records': {
      id: '/_layout/visualize/records'
      path: '/visualize/records'
      fullPath: '/visualize/records'
      preLoaderRoute: typeof LayoutVisualizeRecordsImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutClassifyCategoryDetailsRoute: typeof LayoutClassifyCategoryDetailsRoute
  LayoutClassifyClassifyRoute: typeof LayoutClassifyClassifyRoute
  LayoutVisualizeChartsRoute: typeof LayoutVisualizeChartsRoute
  LayoutVisualizeGraphsRoute: typeof LayoutVisualizeGraphsRoute
  LayoutVisualizeRecordsRoute: typeof LayoutVisualizeRecordsRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutClassifyCategoryDetailsRoute: LayoutClassifyCategoryDetailsRoute,
  LayoutClassifyClassifyRoute: LayoutClassifyClassifyRoute,
  LayoutVisualizeChartsRoute: LayoutVisualizeChartsRoute,
  LayoutVisualizeGraphsRoute: LayoutVisualizeGraphsRoute,
  LayoutVisualizeRecordsRoute: LayoutVisualizeRecordsRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/': typeof LayoutIndexRoute
  '/classify/categoryDetails': typeof LayoutClassifyCategoryDetailsRoute
  '/classify/classify': typeof LayoutClassifyClassifyRoute
  '/visualize/charts': typeof LayoutVisualizeChartsRoute
  '/visualize/graphs': typeof LayoutVisualizeGraphsRoute
  '/visualize/records': typeof LayoutVisualizeRecordsRoute
}

export interface FileRoutesByTo {
  '/': typeof LayoutIndexRoute
  '/classify/categoryDetails': typeof LayoutClassifyCategoryDetailsRoute
  '/classify/classify': typeof LayoutClassifyClassifyRoute
  '/visualize/charts': typeof LayoutVisualizeChartsRoute
  '/visualize/graphs': typeof LayoutVisualizeGraphsRoute
  '/visualize/records': typeof LayoutVisualizeRecordsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/': typeof LayoutIndexRoute
  '/_layout/classify/categoryDetails': typeof LayoutClassifyCategoryDetailsRoute
  '/_layout/classify/classify': typeof LayoutClassifyClassifyRoute
  '/_layout/visualize/charts': typeof LayoutVisualizeChartsRoute
  '/_layout/visualize/graphs': typeof LayoutVisualizeGraphsRoute
  '/_layout/visualize/records': typeof LayoutVisualizeRecordsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
<<<<<<< HEAD
    | '/'
    | '/classify/categoryDetails'
    | '/classify/classify'
    | '/visualize/charts'
    | '/visualize/records'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/classify/categoryDetails'
    | '/classify/classify'
    | '/visualize/charts'
=======
    | '/classify'
    | '/'
    | '/visualize/charts'
    | '/visualize/graphs'
    | '/visualize/records'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/classify'
    | '/'
    | '/visualize/charts'
    | '/visualize/graphs'
>>>>>>> 15a67b3 (scholarly)
    | '/visualize/records'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/'
    | '/_layout/classify/categoryDetails'
    | '/_layout/classify/classify'
    | '/_layout/visualize/charts'
    | '/_layout/visualize/graphs'
    | '/_layout/visualize/records'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/",
        "/_layout/classify/categoryDetails",
        "/_layout/classify/classify",
        "/_layout/visualize/charts",
        "/_layout/visualize/graphs",
        "/_layout/visualize/records"
      ]
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/classify/categoryDetails": {
      "filePath": "_layout/classify/categoryDetails.tsx",
      "parent": "/_layout"
    },
    "/_layout/classify/classify": {
      "filePath": "_layout/classify/classify.tsx",
      "parent": "/_layout"
    },
    "/_layout/visualize/charts": {
      "filePath": "_layout/visualize/charts.tsx",
      "parent": "/_layout"
    },
    "/_layout/visualize/graphs": {
      "filePath": "_layout/visualize/graphs.tsx",
      "parent": "/_layout"
    },
    "/_layout/visualize/records": {
      "filePath": "_layout/visualize/records.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
