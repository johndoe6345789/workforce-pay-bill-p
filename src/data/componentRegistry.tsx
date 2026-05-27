export type { ComponentCategory, ComponentItem } from './componentRegistry.types'
import { buttonItems } from './componentRegistry.buttons'
import { formItems } from './componentRegistry.forms'
import { displayItems } from './componentRegistry.display'
import { feedbackLayoutItems } from './componentRegistry.feedback-layout'
import { hookItems } from './componentRegistry.hooks'

export const components = [
  ...buttonItems,
  ...formItems,
  ...displayItems,
  ...feedbackLayoutItems,
]

export const hooks = hookItems

export const allItems = [...components, ...hooks]
