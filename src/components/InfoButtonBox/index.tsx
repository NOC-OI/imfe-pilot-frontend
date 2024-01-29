import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { InfoButtonBoxContainer, InfoButtonBoxContent } from './styles'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkBreaks from 'remark-breaks'
import 'katex/dist/katex.min.css'

interface InfoButtonBoxProps {
  infoButtonBox: any
  setInfoButtonBox: any
}

export function InfoButtonBox({
  infoButtonBox,
  setInfoButtonBox,
}: InfoButtonBoxProps) {
  function handleClose() {
    setInfoButtonBox({})
  }

  return (
    <InfoButtonBoxContainer id="info-subsection" className="w-80">
      <div>
        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClose} />
      </div>
      <div className="font-bold text-center pb-3">
        <ReactMarkdown
          children={infoButtonBox.title}
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
          rehypePlugins={[rehypeKatex]}
          linkTarget={'_blank'}
        />
      </div>
      <InfoButtonBoxContent className="content-center pb-2">
        <ReactMarkdown
          children={infoButtonBox.content}
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
          rehypePlugins={[rehypeKatex]}
          linkTarget={'_blank'}
        />
      </InfoButtonBoxContent>
    </InfoButtonBoxContainer>
  )
}
