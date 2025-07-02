"use client"

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Helper function to generate color variations
function generateColorVariations(baseColor) {
  // Convert hex to RGB for calculations
  const r = Number.parseInt(baseColor.slice(1, 3), 16)
  const g = Number.parseInt(baseColor.slice(3, 5), 16)
  const b = Number.parseInt(baseColor.slice(5, 7), 16)

  // Create lighter and darker variations
  const lighterColor = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`
  const darkerColor = `rgb(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)})`

  return {
    base: baseColor,
    lighter: lighterColor,
    darker: darkerColor,
    rgba: (alpha) => hexToRgba(baseColor, alpha),
  }
}

export default function Ball({ baseColor = "#000000", isBouncing = true, isSmall = false }) {
  const colors = generateColorVariations(baseColor)

  return (
    <div>
      <div
        className={`ball-3d group ${isBouncing && !isSmall ? "bouncing" : ""} ${isSmall ? "small" : "cursor-pointer"}`}
        style={{
          "--base-color": colors.base,
          "--darker-color": colors.darker,
        }}
      >
        <div className="ball-inner"></div>
      </div>

      <style jsx>{`
        .ball-3d {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          position: relative;
          background: linear-gradient(135deg, var(--base-color) 0%, var(--darker-color) 100%);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          transform-style: preserve-3d;
        }
        
        .ball-3d::before {
          content: '';
          position: absolute;
          top: 30px;
          left: 40px;
          width: 60px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
          filter: blur(2px);
          transform: rotate(-20deg);
        }
        
        .ball-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
          position: relative;
          overflow: hidden;
        }
        
        .ball-inner::before {
          content: '';
          position: absolute;
          top: 20%;
          left: 20%;
          width: 30%;
          height: 30%;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
        }
        
        /* Bounce animation controlled by isBouncing prop */
        .ball-3d.bouncing {
          animation: bounce 0.75s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          10% {
            transform: translateY(-2px);
          }
          20% {
            transform: translateY(-4px);
          }
          25% {
            transform: translateY(-5px);
          }
          35% {
            transform: translateY(-7px);
          }
          50% {
            transform: translateY(-10px);
          }
          65% {
            transform: translateY(-7px);
          }
          75% {
            transform: translateY(-5px);
          }
          80% {
            transform: translateY(-2px);
          }
          90% {
            transform: translateY(-1px);
          }
        }

        /* Small ball variant */
        .ball-3d.small {
          width: 10px;
          height: 10px;
        }

        .ball-3d.small::before {
          top: 6px;
          left: 8px;
          width: 12px;
          height: 8px;
        }
      `}</style>
    </div>
  )
}
