import { useState } from 'react'
import './RequestForm.css'

interface FormData {
  requestType: string
  assetType: string
  team: string
  requester: string
  problem: string
  screens: string
  triedExisting: boolean
  triedExistingDetail: string
  hasBenchmark: boolean
  benchmark: string
  hasProposal: boolean
  proposal: string
  urgency: string
}

interface Step {
  key: string
  title: string
  fields: Field[]
}

interface Field {
  key: string
  label: string
  type: 'choice' | 'text' | 'textarea' | 'checkbox' | 'conditional-text'
  options?: string[]
  placeholder?: string
  conditionKey?: string // show only when this key is true
}

const STEPS: Step[] = [
  {
    key: 'type',
    title: 'Tipo de solicitud',
    fields: [
      { key: 'requestType', label: '¿Qué tipo de consulta es?', type: 'choice', options: ['Nuevo componente/asset', 'Iteración', 'Bug / Inconsistencia', 'Soporte de uso', 'Documentación'] },
    ]
  },
  {
    key: 'asset',
    title: 'Tipo de asset',
    fields: [
      { key: 'assetType', label: '¿Qué tipo de asset involucra?', type: 'choice', options: ['Componente', 'Ícono', 'Ilustración', 'Brand / Logo', 'Token', 'Otro'] },
    ]
  },
  {
    key: 'who',
    title: 'Información del solicitante',
    fields: [
      { key: 'requester', label: 'Tu nombre', type: 'text', placeholder: 'Nombre y apellido' },
      { key: 'team', label: 'Tribu / Producto', type: 'text', placeholder: 'Ej: Pagos, Onboarding, Mi línea...' },
    ]
  },
  {
    key: 'problem',
    title: 'Contexto del pedido',
    fields: [
      { key: 'problem', label: '¿Qué problema estás intentando resolver?', type: 'textarea', placeholder: 'Describí el contexto y la necesidad...' },
      { key: 'screens', label: 'Pantallas o flujos donde se necesita', type: 'textarea', placeholder: 'Links a Figma o descripción...' },
    ]
  },
  {
    key: 'research',
    title: 'Investigación previa',
    fields: [
      { key: 'triedExisting', label: '¿Probaste con componentes existentes?', type: 'checkbox' },
      { key: 'triedExistingDetail', label: '¿Cuáles probaste y por qué no funcionan?', type: 'conditional-text', conditionKey: 'triedExisting', placeholder: 'Ej: probé Button pero no tiene variante con ícono a la derecha...' },
      { key: 'hasBenchmark', label: '¿Tenés referencias de otros productos?', type: 'checkbox' },
      { key: 'benchmark', label: 'Links o descripción del benchmark', type: 'conditional-text', conditionKey: 'hasBenchmark', placeholder: 'Links a productos, DS, o screenshots (2-3 referencias)' },
      { key: 'hasProposal', label: '¿Tenés una propuesta diseñada?', type: 'checkbox' },
      { key: 'proposal', label: 'Link al frame de Figma', type: 'conditional-text', conditionKey: 'hasProposal', placeholder: 'https://www.figma.com/design/...' },
    ]
  },
  {
    key: 'urgency',
    title: 'Urgencia',
    fields: [
      { key: 'urgency', label: '¿Qué urgencia tiene?', type: 'choice', options: ['Alta', 'Media', 'Baja'] },
    ]
  },
]

export function RequestForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    requestType: '', assetType: '', team: '', requester: '',
    problem: '', screens: '', triedExisting: false, triedExistingDetail: '',
    hasBenchmark: false, benchmark: '', hasProposal: false, proposal: '',
    urgency: '',
  })
  const [submitted, setSubmitted] = useState(false)

  // Skip asset type step if not "Nuevo componente/asset"
  const visibleSteps = STEPS.filter(s => {
    if (s.key === 'asset' && formData.requestType !== 'Nuevo componente/asset') return false
    return true
  })
  const currentVisibleStep = visibleSteps[step]
  const isLastVisibleStep = step === visibleSteps.length - 1

  function canAdvance(): boolean {
    for (const field of currentVisibleStep.fields) {
      if (field.type === 'conditional-text') continue
      if (field.type === 'checkbox') continue
      const value = formData[field.key as keyof FormData]
      if (typeof value === 'string' && !value.trim()) return false
    }
    return true
  }

  function handleNext() {
    if (isLastVisibleStep) handleSubmit()
    else setStep(step + 1)
  }

  function handleBack() {
    if (step > 0) setStep(step - 1)
  }

  function updateField(key: string, value: string | boolean) {
    setFormData({ ...formData, [key]: value })
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
          <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(0); setFormData({ requestType: '', assetType: '', team: '', requester: '', problem: '', screens: '', triedExisting: false, triedExistingDetail: '', hasBenchmark: false, benchmark: '', hasProposal: false, proposal: '', urgency: '' }) }}>
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
            <div className="progress-fill" style={{ width: `${((step + 1) / visibleSteps.length) * 100}%` }} />
          </div>
          <span className="progress-text">{step + 1} / {visibleSteps.length}</span>
        </div>

        {/* Step title */}
        <h2 className="step-title">{currentVisibleStep.title}</h2>

        {/* Fields */}
        <div className="step-fields" key={step}>
          {currentVisibleStep.fields.map(field => {
            // Conditional fields: only show when condition is met
            if (field.type === 'conditional-text') {
              const conditionValue = formData[field.conditionKey as keyof FormData]
              if (!conditionValue) return null
            }

            return (
              <div key={field.key} className="field-group">
                {field.type === 'choice' && (
                  <>
                    <label className="field-label">{field.label}</label>
                    <div className="choice-grid">
                      {field.options!.map(option => (
                        <button
                          key={option}
                          className={`choice-btn ${formData[field.key as keyof FormData] === option ? 'selected' : ''}`}
                          onClick={() => updateField(field.key, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {field.type === 'text' && (
                  <>
                    <label className="field-label">{field.label}</label>
                    <input
                      type="text"
                      className="request-input"
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof FormData] as string}
                      onChange={e => updateField(field.key, e.target.value)}
                    />
                  </>
                )}

                {field.type === 'textarea' && (
                  <>
                    <label className="field-label">{field.label}</label>
                    <textarea
                      className="request-textarea"
                      placeholder={field.placeholder}
                      value={formData[field.key as keyof FormData] as string}
                      onChange={e => updateField(field.key, e.target.value)}
                      rows={3}
                    />
                  </>
                )}

                {field.type === 'checkbox' && (
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={formData[field.key as keyof FormData] as boolean}
                      onChange={e => updateField(field.key, e.target.checked)}
                    />
                    <span className="checkbox-label">{field.label}</span>
                  </label>
                )}

                {field.type === 'conditional-text' && (
                  <textarea
                    className="request-textarea conditional"
                    placeholder={field.placeholder}
                    value={formData[field.key as keyof FormData] as string}
                    onChange={e => updateField(field.key, e.target.value)}
                    rows={2}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="request-nav">
          {step > 0 && (
            <button className="btn-back" onClick={handleBack}>← Atrás</button>
          )}
          <div className="nav-spacer" />
          <button
            className="btn-next"
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            {isLastVisibleStep ? 'Enviar solicitud' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  )
}
