import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn('space-y-4', className)} {...props}>
      {children}
    </section>
  )
}

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SectionHeader({ children, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export interface SectionTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function SectionTitle({ children, className, ...props }: SectionTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-foreground', className)} {...props}>
      {children}
    </h2>
  )
}

export interface SectionDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function SectionDescription({ children, className, ...props }: SectionDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export interface SectionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function SectionContent({ children, className, ...props }: SectionContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}
