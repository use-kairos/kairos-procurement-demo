export type Platform = { name: string; logo: string }

// Personal-agent platforms the plugin can be installed into (illustrative).
// Logos: LobeHub icons (MIT), Simple Icons (CC0), site favicons; vendored in public/logos.
export const PLATFORMS: Platform[] = [
  { name: 'ChatGPT', logo: '/logos/chatgpt.svg' },
  { name: 'Claude', logo: '/logos/claude.svg' },
  { name: 'Gemini', logo: '/logos/gemini.svg' },
  { name: 'Meta AI', logo: '/logos/metaai.svg' },
  { name: 'Grok', logo: '/logos/grok.svg' },
  { name: 'Copilot', logo: '/logos/copilot.svg' },
  { name: 'Siri', logo: '/logos/siri.svg' },
  { name: 'Alexa+', logo: '/logos/alexa.png' },
  { name: 'Perplexity', logo: '/logos/perplexity.svg' },
  { name: 'Muse', logo: '/logos/muse.png' },
  { name: 'Manus', logo: '/logos/manus.svg' },
  { name: 'OpenClaw', logo: '/logos/openclaw.svg' },
  { name: 'Hermes Agent', logo: '/logos/hermes.svg' },
  { name: 'Genspark', logo: '/logos/genspark.png' },
  { name: 'Lindy', logo: '/logos/lindy.png' },
  { name: 'Doubao', logo: '/logos/doubao.svg' },
  { name: 'Kimi', logo: '/logos/kimi.svg' },
  { name: 'Qwen', logo: '/logos/qwen.svg' },
  { name: 'DeepSeek', logo: '/logos/deepseek.svg' },
  { name: 'Mistral', logo: '/logos/mistral.svg' },
]

export const STANDARDS = [
  { name: 'MCP', what: 'Model Context Protocol' },
  { name: 'A2A', what: 'Agent-to-agent protocol' },
  { name: 'AP2', what: 'Agent Payments Protocol' },
  { name: 'Visa', what: 'Intelligent Commerce tokens' },
  { name: 'Mastercard', what: 'Agent Pay' },
  { name: 'ISO 20022', what: 'Payment messages' },
  { name: 'FAST · PayNow', what: 'Singapore rails' },
  { name: 'Singpass', what: 'National digital ID' },
  { name: 'FIDO2', what: 'Passkeys & hardware keys' },
  { name: 'ML-DSA', what: 'Quantum-safe signatures (FIPS 204)' },
]
