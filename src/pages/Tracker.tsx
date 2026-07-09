import { useState, useMemo, useEffect } from 'react'
import './Tracker.css'

interface Request {
  id: string
  date: string
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
  status: string
  resolution: string
  assignedTo: string
  resolvedAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#D96606',
  'in-progress': '#5A50F9',
  resolved: '#15803D',
  rejected: '#B91C1C',
}

export function Tracker() {
  const [requests, setRequests] = useState<Request[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ds-requests') || '[]')
    setRequests(stored)
  }, [])

  const filtered = useMemo(() => {
    let result = requests
    if (filterStatus !== 'all') result = result.filter(r => r.status === filterStatus)
    if (filterType !== 'all') result = result.filter(r => r.requestType === filterType)
    return result
  }, [requests, filterStatus, filterType])

  // Metrics
  const metrics = useMemo(() => {
    const total = requests.length
    const pending = requests.filter(r => r.status === 'pending').length
    const resolved = requests.filter(r => r.status === 'resolved').length
    const byType: Record<string, number> = {}
    const byAsset: Record<string, number> = {}
    for (const r of requests) {
      byType[r.requestType] = (byType[r.requestType] || 0) + 1
      byAsset[r.assetType] = (byAsset[r.assetType] || 0) + 1
    }
    return { total, pending, resolved, byType, byAsset }
  }, [requests])

  function updateStatus(id: string, status: string) {
    const updated = requests.map(r => r.id === id ? { ...r, status, resolvedAt: status === 'resolved' ? new Date().toISOString() : r.resolvedAt } : r)
    setRequests(updated)
    localStorage.setItem('ds-requests', JSON.stringify(updated))
  }

  return (
    <div className="tracker-page">
      <div className="tracker-container">
        <h1 className="page-title">Tracker</h1>
        <p className="page-description">Seguimiento de pedidos al Design System</p>

        {/* Metrics */}
        <div className="tracker-metrics">
          <div className="metric-card">
            <span className="metric-value">{metrics.total}</span>
            <span className="metric-label">Total</span>
          </div>
          <div className="metric-card metric-pending">
            <span className="metric-value">{metrics.pending}</span>
            <span className="metric-label">Pendientes</span>
          </div>
          <div className="metric-card metric-resolved">
            <span className="metric-value">{metrics.resolved}</span>
            <span className="metric-label">Resueltos</span>
          </div>
          {Object.entries(metrics.byType).slice(0, 3).map(([type, count]) => (
            <div key={type} className="metric-card">
              <span className="metric-value">{count}</span>
              <span className="metric-label">{type}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="tracker-filters">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En progreso</option>
            <option value="resolved">Resuelto</option>
            <option value="rejected">Rechazado</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="Nuevo componente/asset">Nuevo</option>
            <option value="Iteración">Iteración</option>
            <option value="Bug / Inconsistencia">Bug</option>
            <option value="Soporte de uso">Soporte</option>
            <option value="Validación">Validación</option>
            <option value="Pattern / Composición">Pattern</option>
            <option value="Documentación">Documentación</option>
          </select>
          <span className="filter-count">{filtered.length} pedidos</span>
        </div>

        {/* List */}
        {filtered.length === 0 && (
          <div className="tracker-empty">
            <p>No hay pedidos registrados todavía.</p>
            <p className="tracker-empty-hint">Los pedidos se crean desde <a href="/request">/request</a></p>
          </div>
        )}

        <div className="tracker-list">
          {filtered.map(req => (
            <div key={req.id} className="tracker-item">
              <button
                className="tracker-item-header"
                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
              >
                <div className="tracker-item-left">
                  <span className="tracker-status-dot" style={{ background: STATUS_COLORS[req.status] }} />
                  <div className="tracker-item-info">
                    <span className="tracker-item-problem">{req.problem.slice(0, 80)}{req.problem.length > 80 ? '...' : ''}</span>
                    <span className="tracker-item-meta">
                      {req.requester} · {req.team} · {new Date(req.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="tracker-item-right">
                  <span className="tracker-badge">{req.requestType}</span>
                  <span className="tracker-badge tracker-badge--asset">{req.assetType}</span>
                  <span className="tracker-urgency" data-urgency={req.urgency.toLowerCase()}>{req.urgency}</span>
                </div>
              </button>

              {expandedId === req.id && (
                <div className="tracker-item-detail">
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Problema</label>
                      <p>{req.problem}</p>
                    </div>
                    <div className="detail-field">
                      <label>Pantallas</label>
                      <p>{req.screens || '—'}</p>
                    </div>
                    <div className="detail-field">
                      <label>¿Qué probó?</label>
                      <p>{req.triedExisting || '—'}</p>
                    </div>
                    <div className="detail-field">
                      <label>Benchmark</label>
                      <p>{req.benchmark || '—'}</p>
                    </div>
                    <div className="detail-field">
                      <label>Propuesta</label>
                      <p>{req.proposal || '—'}</p>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <label>Estado:</label>
                    <select value={req.status} onChange={e => updateStatus(req.id, e.target.value)}>
                      <option value="pending">Pendiente</option>
                      <option value="in-progress">En progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="rejected">Rechazado</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
