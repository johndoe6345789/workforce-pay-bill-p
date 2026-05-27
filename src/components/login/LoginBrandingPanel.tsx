import { Buildings } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'

const FEATURES = [
  { titleKey: 'login.streamlinedOperations', descKey: 'login.streamlinedOperationsDesc' },
  { titleKey: 'login.realTimeInsights', descKey: 'login.realTimeInsightsDesc' },
  { titleKey: 'login.enterpriseSecurity', descKey: 'login.enterpriseSecurityDesc' },
] as const

export function LoginBrandingPanel() {
  const { t } = useTranslation()
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-primary/80 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col justify-center px-16 text-white">
        <div className="mb-8">
          <Buildings size={64} weight="duotone" />
        </div>
        <h1 className="text-5xl font-semibold mb-6 leading-tight">
          {t('login.welcomeTo')}<br />{t('login.workforcePro')}
        </h1>
        <p className="text-xl text-white/90 leading-relaxed max-w-md">
          {t('login.platformDescription')}
        </p>
        <div className="mt-12 space-y-4">
          {FEATURES.map(({ titleKey, descKey }) => (
            <div key={titleKey} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{t(titleKey)}</h3>
                <p className="text-white/80 text-sm">{t(descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
