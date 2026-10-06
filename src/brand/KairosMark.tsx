import './brand.css'

// The Kairos mark (navy + gold on white), sized to fill whatever tile it sits in.
export default function KairosMark({ size }: { size: number }) {
  return <img className="kairos-mark" src="/kairos-logo.svg" width={size} height={size} alt="Kairos" />
}
