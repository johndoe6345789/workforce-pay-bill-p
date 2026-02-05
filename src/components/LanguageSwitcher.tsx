import { Check, Globe } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/hooks/use-translation'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français'
}

export function LanguageSwitcher() {
  const { locale, changeLocale, availableLocales } = useTranslation()

  const handleLocaleChange = (newLocale: string) => {
    changeLocale(newLocale as 'en' | 'es' | 'fr')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe size={18} />
          <span className="hidden sm:inline">{LOCALE_NAMES[locale || 'en']}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableLocales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{LOCALE_NAMES[loc]}</span>
            {locale === loc && <Check size={16} weight="bold" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
