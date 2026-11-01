import { useState } from 'react'

const heroNodes = [
  {
    id: 'engine',
    category: 'Двигатель и выхлоп',
    label: 'ДВИГАТЕЛЬ И ВЫХЛОП',
    sub: 'Поршневая группа и ГРМ',
    auraClass: 'aura--emerald',
    imgSrc: '/img/hero/part-engine.webp',
    alt: 'Кристаллический поршень с шатуном',
    caption: 'ОТКРЫТЬ: ДВИГАТЕЛЬ И ВЫХЛОП',
  },
  {
    id: 'brakes',
    category: 'Тормозная система',
    label: 'ТОРМОЗНАЯ СИСТЕМА',
    sub: 'Диски, колодки и суппорты',
    auraClass: 'aura--ruby',
    imgSrc: '/img/hero/part-brake.webp',
    alt: 'Кристаллический тормозной диск',
    caption: 'ОТКРЫТЬ: ТОРМОЗНАЯ СИСТЕМА',
  },
  {
    id: 'suspension',
    category: 'Подвеска и рулевое',
    label: 'ПОДВЕСКА И РУЛЕВОЕ',
    sub: 'Амортизаторы, рычаги и тяги',
    auraClass: 'aura--sapphire',
    imgSrc: '/img/hero/part-suspension.webp',
    alt: 'Кристаллическая амортизаторная пружина',
    caption: 'ОТКРЫТЬ: ПОДВЕСКА И РУЛЕВОЕ',
  },
  {
    id: 'electrics',
    category: 'Электрика и свет',
    label: 'ЭЛЕКТРИКА И СВЕТ',
    sub: 'Зажигание, датчики и оптика',
    auraClass: 'aura--topaz',
    imgSrc: '/img/hero/part-electrics.webp',
    alt: 'Кристаллическая свеча зажигания',
    caption: 'ОТКРЫТЬ: ЭЛЕКТРИКА И СВЕТ',
  },
  {
    id: 'filters',
    category: 'Фильтры и масла',
    label: 'ФИЛЬТРЫ И МАСЛА',
    sub: 'Масляные, воздушные и ТО',
    auraClass: 'aura--diamond',
    imgSrc: '/img/hero/part-transmission.webp',
    alt: 'Шестерня трансмиссии с кристаллами',
    caption: 'ОТКРЫТЬ: ФИЛЬТРЫ И МАСЛА',
  },
]

function HeroLanding({ onSelectCategory }) {
  const [activeCaption, setActiveCaption] = useState('ОТКРЫТЬ КАТАЛОГ УЗЛОВ')
  const [activeNodeId, setActiveNodeId] = useState(null)

  function handleNodeClick(category) {
    onSelectCategory(category)
    const anchor = document.getElementById('catalog-anchor')
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="choeur-hero-stage wc-ready">
      {/* SVG-фильтр «акварель»: рваный край цветного пятна при наведении */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="emeraldBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ae092" />
            <stop offset="50%" stopColor="#146b42" />
            <stop offset="100%" stopColor="#07331e" />
          </linearGradient>
          <linearGradient id="sapphireBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ba4f5" />
            <stop offset="50%" stopColor="#244b8a" />
            <stop offset="100%" stopColor="#0c1d3d" />
          </linearGradient>
        </defs>
        <filter
          id="watercolor"
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="46"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rough"
          />
          <feGaussianBlur in="rough" stdDeviation="5" />
        </filter>
      </svg>

      {/* Контейнер экспозиции категорий узлов */}
      <div className="choeur-chapters-viewport">
        <div className="stones-chorus-showcase">
          {heroNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={`stone-node-card ${activeNodeId === node.id ? 'active' : ''}`}
              onMouseEnter={() => {
                setActiveCaption(node.caption)
                setActiveNodeId(node.id)
              }}
              onMouseLeave={() => {
                setActiveCaption('ОТКРЫТЬ КАТАЛОГ УЗЛОВ')
                setActiveNodeId(null)
              }}
              onClick={() => handleNodeClick(node.category)}
            >
              <div className="gem-part-stage">
                <div className={`stone-gouache-aura ${node.auraClass}`} />
                <img
                  className="gem-part-img"
                  src={node.imgSrc}
                  alt={node.alt}
                  width="480"
                  height="540"
                  loading="eager"
                />
              </div>
              <span className="stone-node-label">{node.label}</span>
              <span className="stone-node-sub">{node.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Монументальная русскоязычная типографика */}
      <div className="choeur-monumental-title">
        <div className="choeur-discover-caption">{activeCaption}</div>
        <div className="line-top">
          <span className="word-italic">Инженерное</span>
          <span className="word-caps">СОВЕРШЕНСТВО</span>
        </div>
        <div className="line-bottom">
          <span className="word-italic">в каждой</span>
          <span className="word-caps">ДЕТАЛИ</span>
        </div>
        <div className="choeur-chapter-subtitle">ГЛАВА I • ЭКСПОЗИЦИЯ УЗЛОВ</div>
      </div>
    </section>
  )
}

export default HeroLanding
