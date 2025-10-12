export function MonicaoLogo() {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
        >
            <defs>
                <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="shineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
                </linearGradient>
            </defs>

            {/* Dente principal */}
            <path
                d="M24 6C19 6 15 9.5 15 14.5C15 16.5 15.5 18.5 16 20C16.5 21.5 17 23 17 25.5C17 30 19 33.5 21 36C22 37.5 22.5 39 24 39C25.5 39 26 37.5 27 36C29 33.5 31 30 31 25.5C31 23 31.5 21.5 32 20C32.5 18.5 33 16.5 33 14.5C33 9.5 29 6 24 6Z"
                fill="url(#toothGradient)"
                stroke="#5b21b6"
                strokeWidth="0.5"
            />

            {/* Brilho no dente */}
            <ellipse cx="20" cy="15" rx="4" ry="7" fill="url(#shineGradient)" />

            {/* Dente grande característico da Mônica - mais sutil */}
            <rect x="21.5" y="10" width="5" height="12" rx="2.5" fill="white" opacity="0.95" />
            <rect x="22.5" y="11" width="3" height="10" rx="1.5" fill="#f3f4f6" />

            {/* Detalhe sutil */}
            <circle cx="24" cy="16" r="0.8" fill="#e5e7eb" />
        </svg>
    )
}
