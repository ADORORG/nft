"use client"
import { default as ErrorPage, type ErrorPageProp } from "@/components/Error"

export default function Error({ error, reset }: ErrorPageProp) {
 
  return (
    <ErrorPage 
      error={error}
      reset={reset}
    />
  )
}