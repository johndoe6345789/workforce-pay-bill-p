import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageHeader({ children, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('space-y-2 mb-6', className)} {...props}>
      {children}
    </div>
  )
}

export interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function PageTitle({ children, className, ...props }: PageTitleProps) {
  return (
    <h1 className={cn('text-3xl font-bold text-foreground', className)} {...props}>
      {children}
    </h1>
  )
}

export interface PageDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function PageDescription({ children, className, ...props }: PageDescriptionProps) {
  return (
    <p className={cn('text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

export interface PageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageActions({ children, className, ...props }: PageActionsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  )
}

export interface PageHeaderRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PageHeaderRow({ children, className, ...props }: PageHeaderRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)} {...props}>
      {children}
    </div>
  )
}
