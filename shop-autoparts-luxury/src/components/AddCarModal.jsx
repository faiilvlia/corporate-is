import { useState } from 'react'
import { brands } from '../data/autopartsData.js'

let nextCarId = 1
function generateCarId(brandId, modelName, year) {
  return `${brandId}_${modelName}_${year}_${nextCarId++}`
}

function AddCarModal({ isOpen, onClose, onAddCar }) {
  const [brandId, setBrandId] = useState('')
  const [modelName, setModelName] = useState('')
  const [year, setYear] = useState('2018')

  if (!isOpen) return null

  const selectedBrandObj = brands.find((b) => b.id === brandId)
  const availableModels = selectedBrandObj ? selectedBrandObj.models : []

  function handleSubmit(e) {
    e.preventDefault()
    if (!brandId || !modelName) return

    onAddCar({
      id: generateCarId(brandId, modelName, year),
      brand: selectedBrandObj.name,
      model: modelName,
      year: parseInt(year, 10) || 2018,
      carKey: `${selectedBrandObj.name}_${modelName}`,
    })

    setBrandId('')
    setModelName('')
    onClose()
  }

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1060 }} />
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1065 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border">
            <div className="modal-header">
              <h5 className="modal-title font-sans-luxury fs-6">
                ДОБАВИТЬ АВТОМОБИЛЬ В ГАРАЖ
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Закрыть"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label htmlFor="modalBrandSelect" className="form-label label-caps">
                    Марка автомобиля
                  </label>
                  <select
                    id="modalBrandSelect"
                    className="form-select form-select-sm"
                    value={brandId}
                    onChange={(e) => {
                      setBrandId(e.target.value)
                      setModelName('')
                    }}
                    required
                  >
                    <option value="">-- Выберите марку --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="modalModelSelect" className="form-label label-caps">
                    Модель
                  </label>
                  <select
                    id="modalModelSelect"
                    className="form-select form-select-sm"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    disabled={!brandId}
                    required
                  >
                    <option value="">
                      {brandId
                        ? '-- Выберите модель --'
                        : '-- Сначала выберите марку --'}
                    </option>
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.yearFrom}–{m.yearTo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="modalYearInput" className="form-label label-caps">
                    Год выпуска
                  </label>
                  <input
                    type="number"
                    id="modalYearInput"
                    className="form-control form-control-sm"
                    placeholder="2018"
                    min="1990"
                    max="2026"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cartier btn-sm"
                  onClick={onClose}
                >
                  ОТМЕНА
                </button>
                <button type="submit" className="btn-cartier-dark btn-sm">
                  СОХРАНИТЬ В ГАРАЖ
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddCarModal
