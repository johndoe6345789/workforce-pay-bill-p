import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from 'react-redux'
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { store } from './store/store'
import { Toaster } from '@/components/ui/sonner'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
   </ErrorBoundary>
)
