import { useState, useRef, MutableRefObject, useLayoutEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

type Arg = HTMLElement | (() => HTMLElement) | null

function useRect<T extends HTMLElement = HTMLElement>(): [
  DOMRect | undefined,
  MutableRefObject<T>
]
function useRect(arg: Arg): [DOMRect | undefined]
function useRect<T extends HTMLElement = HTMLElement>(
  ...args: [Arg] | []
): [DOMRect | undefined, MutableRefObject<T>?] {
  const hasPassedInElement = args.length === 1
  const arg = useRef(args[0])
  ;[arg.current] = args
  const element = useRef<T>()
  const [state, setState] = useState<DOMRect | undefined>()

  useLayoutEffect(() => {
    const passedInElement =
      typeof arg.current === 'function' ? arg.current() : arg.current
    const targetElement = hasPassedInElement ? passedInElement : element.current
    if (!targetElement) {
      return () => undefined
    }

    const resizeObserver = new ResizeObserver((entries: any) => {
      entries.forEach((entry: any) => {
        if (entry.target) {
          setState(entry.target.getBoundingClientRect())
        }
      })
    })

    resizeObserver.observe(targetElement)
    return () => {
      resizeObserver.disconnect()
    }
  }, [hasPassedInElement])

  if (hasPassedInElement) {
    return [state]
  }
  return [state, element as MutableRefObject<T>]
}

export { useRect }
