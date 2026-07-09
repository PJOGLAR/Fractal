import { useState } from 'react'
import './RequestForm.css'

interface FormData {
  requestType: string
  assetType: string
  team: string
  requester: string
  problem: string
  screens: string
  triedExisting: string
  benchmark: string
  proposal: string
  urgency: string
}

const STEPS = [
  { key: 'requestType', question: '¿Qué tipo de consulta es?', type: 'choice', options: ['Nuevo componente/asset', 'Iteración', 'Bug / Inconsistencia', 'Soporte de uso', 'Validación', 'Pattern / Composición', 'Documentación'] },
  { key: 'assetType', question: '¿Qué tipo de asset involucra?', type: 'choice', options: ['Componente', 'Ícono', 'Ilustración', 'Brand / Logo', 'Token', 'Otro'] },
  { key: 'team', question: '¿De qué tribu o producto es?', type: 'text', placeholder: 'Ej: Pagos, Onboarding, Mi línea...' },
  { key: 'requester', question: '¿Quién solicita?', type: 'text', placeholder: 'Tu nombre' },
  { key: 'problem', question: '¿Qué problema estás intentando resolver?', type: 'textarea', placeholder: 'Describí el contexto y la necesidad...' },
  { key: 'screens', question: '¿En qué pantallas o flujos se necesita?', type: 'textarea', placeholder: 'Links a Figma o descripción de las pantallas...' },
  { key: 'triedExisting', question: '¿Probaste con componentes existentes?', type: 'textarea', placeholder: '¿Cuáles probaste y por qué no funcionan?' },
  { key: 'benchmark', question: '¿Tenés referencias de cómo lo resuelven otros?', type: 'textarea', placeholder: 'Links a productos, DS, o screenshots (2-3 referencias)' },
  { key: 'proposal', question: '¿Tenés una propuesta diseñada?', type: 'text', placeholder: 'Link al frame de Figma (opcional)' },
  { key: 'urgency', question: '¿Qué urgencia tiene?', type: 'choice', options: ['Alta', 'Media', 'Baja'] },
]

export function RequestForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    requestType: '', assetType: '', team: '', requester: '',
    problem: '', screens: '', triedExisting: '', benchmark: '',
    proposal: '', urgency: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const currentStep = STEPS[step]
  const currentValue = formData[currentStep.key as keyof FormData]
  const isLastStep = step === STEPS.length - 1
  const canAdvance = currentValue.trim().length > 0

  function handleChoice(value: string) {
    setFormData({ ...formData, [currentStep.key]: value })
    if (!isLastStep) {
      setTimeout(() => setStep(step + 1), 200)
    }
  }

  function handleNext() {
    if (isLastStep) {
      handleSubmit()
    } else {
      setStep(step + 1)
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && canAdvance) {
      e.preventDefault()
      handleNext()
    }
  }

  function handleSubmit() {
    const entry = {
      ...formData,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(),
      status: 'pending',
      resolution: '',
      assignedTo: '',
      resolvedAt: '',
    }
    // Save to localStorage (will sync to JSON later)
    const existing = JSON.parse(localStorage.getItem('ds-requests') || '[]')
    existing.unshift(entry)
    localStorage.setItem('ds-requests', JSON.stringify(existing))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="request-page">
        <div className="request-card request-success">
          <div className="success-icon">✓</div>
          <h2>Solicitud enviada</h2>
          <p>Tu pedido fue registrado. El equipo de DS lo va a revisar en la próxima sesión.</p>
          <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(0); setFormData({ requestType: '', assetType: '', team: '', requester: '', problem: '', screens: '', triedExisting: '', benchmark: '', proposal: '', urgency: '' }) }}>
            Enviar otra solicitud
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="request-page">
      <div className="request-card">
        {/* Progress */}
        <div className="request-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
          <span className="progress-text">{step + 1} / {STEPS.length}</span>
        </div>

        {/* Question */}
        <div className="request-question" key={step}>
          <h2 className="question-text">{currentStep.question}</h2>

          {currentStep.type === 'choice' && (
            <div className="choice-grid">
              {currentStep.options!.map(option => (
                <button
                  key={option}
                  className={`choice-btn ${currentValue === option ? 'selected' : ''}`}
                  onClick={() => handleChoice(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentStep.type === 'text' && (
            <input
              type="text"
              className="request-input"
              placeholder={currentStep.placeholder}
              value={currentValue}
              onChange={e => setFormData({ ...formData, [currentStep.key]: e.target.value })}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          )}

          {currentStep.type === 'textarea' && (
            <textarea
              className="request-textarea"
              placeholder={currentStep.placeholder}
              value={currentValue}
              onChange={e => setFormData({ ...formData, [currentStep.key]: e.target.value })}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={4}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="request-nav">
          {step > 0 && (
            <button className="btn-back" onClick={handleBack}>← Atrás</button>
          )}
          <div className="nav-spacer" />
          {(currentStep.type !== 'choice' || currentValue) && (
            <button
              className="btn-next"
              onClick={handleNext}
              disabled={!canAdvance}
            >
              {isLastStep ? 'Enviar solicitud' : 'Siguiente →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
