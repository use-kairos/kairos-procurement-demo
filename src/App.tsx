import { useState } from 'react'
import IntroScene from './intro/IntroScene'
import Workspace from './workspace/Workspace'

type Stage = 'intro' | 'workspace'

const skipIntro = new URLSearchParams(window.location.search).has('skip')

export default function App() {
  const [stage, setStage] = useState<Stage>(skipIntro ? 'workspace' : 'intro')

  return stage === 'intro' ? (
    <IntroScene onEnter={() => setStage('workspace')} />
  ) : (
    <Workspace />
  )
}
