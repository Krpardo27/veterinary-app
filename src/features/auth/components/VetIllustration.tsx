export default function VetIllustration() {
  return (
    <svg
      viewBox="0 0 320 240"
      className="h-auto w-full max-w-sm"
      aria-hidden="true"
    >
      <style>{`
        @keyframes tailWag {
          0%,100% { transform: rotate(-6deg); }
          50% { transform: rotate(10deg); }
        }

        @keyframes chestPulse {
          0%,100% { r:6; opacity:.9; }
          50% { r:8; opacity:.45; }
        }

        @keyframes ekgDraw {
          from { stroke-dashoffset:260; }
          to { stroke-dashoffset:0; }
        }

        @keyframes leafFloat{
          0%,100%{ transform:translateY(0px); }
          50%{ transform:translateY(-4px); }
        }

        .tail{
          transform-origin:78px 208px;
          animation:tailWag 1.5s ease-in-out infinite;
        }

        .chest-piece{
          animation:chestPulse 1.8s ease-in-out infinite;
        }

        .ekg{
          stroke-dasharray:260;
          animation:ekgDraw 2.4s linear infinite;
        }

        .leaf{
          animation:leafFloat 3s ease-in-out infinite;
        }

        @media(prefers-reduced-motion:reduce){
          .tail,.chest-piece,.ekg,.leaf{
            animation:none!important;
          }
        }
      `}</style>

      {/* Fondo */}
      <circle
        cx="160"
        cy="120"
        r="108"
        fill="#ECFDF5"
      />

      <circle
        cx="160"
        cy="120"
        r="108"
        fill="none"
        stroke="#0F766E"
        strokeOpacity=".12"
        strokeDasharray="5 8"
      />

      {/* Hojas */}
      <g className="leaf">
        <path
          d="M42 55 C32 38 48 24 63 34 C63 52 56 63 42 55Z"
          fill="#A7F3D0"
        />

        <path
          d="M270 54 C286 40 297 58 286 73 C270 68 263 60 270 54Z"
          fill="#A7F3D0"
        />
      </g>

      {/* Gato */}
      <g transform="translate(205 62)">
        <path d="M0 38 L-14 10 L6 20 Z" fill="#FFF7ED" />
        <path d="M60 38 L74 10 L54 20 Z" fill="#FFF7ED" />

        <circle
          cx="30"
          cy="54"
          r="39"
          fill="#FFF7ED"
        />

        <circle cx="18" cy="50" r="3.5" fill="#1F2937" />
        <circle cx="42" cy="50" r="3.5" fill="#1F2937" />

        <ellipse
          cx="30"
          cy="62"
          rx="3.5"
          ry="2.5"
          fill="#0F172A"
        />

        <path
          d="M22 67 Q30 74 38 67"
          stroke="#0F172A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        <line x1="4" y1="60" x2="18" y2="58" stroke="#94A3B8" />
        <line x1="4" y1="68" x2="18" y2="68" stroke="#94A3B8" />
        <line x1="42" y1="58" x2="56" y2="60" stroke="#94A3B8" />
        <line x1="42" y1="68" x2="56" y2="68" stroke="#94A3B8" />
      </g>

      {/* Sombra */}
      <ellipse
        cx="122"
        cy="220"
        rx="72"
        ry="10"
        fill="#000"
        opacity=".08"
      />

      {/* Cola */}
      <path
        className="tail"
        d="M78 208 Q40 188 56 158"
        stroke="#B7793F"
        strokeWidth="13"
        fill="none"
        strokeLinecap="round"
      />

      {/* Cuerpo */}
      <ellipse
        cx="120"
        cy="166"
        rx="68"
        ry="50"
        fill="#D6A36A"
      />

      {/* Orejas */}
      <ellipse
        cx="72"
        cy="110"
        rx="17"
        ry="28"
        fill="#B7793F"
        transform="rotate(-25 72 110)"
      />

      <ellipse
        cx="168"
        cy="110"
        rx="17"
        ry="28"
        fill="#B7793F"
        transform="rotate(25 168 110)"
      />

      {/* Cabeza */}
      <circle
        cx="120"
        cy="138"
        r="49"
        fill="#D6A36A"
      />

      {/* Hocico */}
      <ellipse
        cx="120"
        cy="156"
        rx="24"
        ry="18"
        fill="#FFF8F2"
      />

      {/* Ojos */}
      <circle cx="101" cy="130" r="5" fill="#0F172A" />
      <circle cx="139" cy="130" r="5" fill="#0F172A" />

      <circle cx="103" cy="128" r="1.5" fill="#fff" />
      <circle cx="141" cy="128" r="1.5" fill="#fff" />

      {/* Nariz */}
      <ellipse
        cx="120"
        cy="148"
        rx="6"
        ry="4"
        fill="#0F172A"
      />

      {/* Sonrisa */}
      <path
        d="M109 159 Q120 168 131 159"
        stroke="#0F172A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Collar veterinario */}
      <rect
        x="94"
        y="171"
        width="52"
        height="8"
        rx="4"
        fill="#0F766E"
      />

      {/* Estetoscopio */}
      <path
        d="M76 168
           Q60 205 100 214
           Q140 222 140 192"
        stroke="#FFFFFF"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      <circle
        className="chest-piece"
        cx="140"
        cy="194"
        r="6"
        fill="#fff"
      />

      {/* Cruz médica */}
      <rect
        x="182"
        y="166"
        width="24"
        height="24"
        rx="6"
        fill="#0F766E"
      />

      <rect
        x="191"
        y="171"
        width="6"
        height="14"
        rx="2"
        fill="#fff"
      />

      <rect
        x="186"
        y="175"
        width="16"
        height="6"
        rx="2"
        fill="#fff"
      />

      {/* ECG */}
      <path
        className="ekg"
        d="
          M15 216
          H55
          L68 206
          L82 220
          L96 186
          L114 225
          L128 203
          L142 216
          H180
        "
        stroke="#0F766E"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}