import type { FC } from 'react'
import Base, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/oceanicNext'
import clsx from 'clsx'

interface HighlightProps {
  code: string
  language?: Language
}
const Highlight: FC<HighlightProps> = ({ code, language = 'bash' }) => (
  <Base {...defaultProps} language={language} theme={theme} code={code.trim()}>
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre className={clsx(className, 'rounded-md p-3 my-4')} style={style}>
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Base>
)

export default Highlight
