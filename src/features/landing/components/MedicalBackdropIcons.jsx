/**
 * Soft medical motif icons for sections that already use ECG/pulse backdrops.
 */
function MedicalBackdropIcons({ tone = "light" }) {
  return (
    <div className={`landing-med-icons landing-med-icons--${tone}`} aria-hidden="true">
      {/* Capsule */}
      <svg className="landing-med-icon landing-med-icon--pill" viewBox="0 0 64 64" fill="none">
        <rect x="10" y="24" width="44" height="16" rx="8" stroke="currentColor" strokeWidth="2" />
        <path d="M32 24 V40" stroke="currentColor" strokeWidth="2" />
        <path d="M18 28 H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      </svg>

      {/* Cross / pharmacy */}
      <svg className="landing-med-icon landing-med-icon--cross" viewBox="0 0 64 64" fill="none">
        <path
          d="M26 12 H38 V26 H52 V38 H38 V52 H26 V38 H12 V26 H26 Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* X-ray / radiology frame */}
      <svg className="landing-med-icon landing-med-icon--xray" viewBox="0 0 64 64" fill="none">
        <rect x="12" y="10" width="40" height="44" rx="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M24 18 V46 M40 18 V46 M20 28 H44 M20 36 H44"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <circle cx="32" cy="32" r="7" stroke="currentColor" strokeWidth="1.8" />
      </svg>

      {/* Stethoscope */}
      <svg className="landing-med-icon landing-med-icon--steth" viewBox="0 0 64 64" fill="none">
        <path
          d="M18 14 V28 C18 38 25 44 32 44 C39 44 46 38 46 28 V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="18" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="46" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M32 44 V50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="54" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Syringe */}
      <svg className="landing-med-icon landing-med-icon--syringe" viewBox="0 0 64 64" fill="none">
        <path
          d="M40 10 L54 24 L28 50 L14 50 L14 36 Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M34 16 L48 30" stroke="currentColor" strokeWidth="1.6" />
        <path d="M22 38 L30 46" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 52 L18 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* DNA helix hint */}
      <svg className="landing-med-icon landing-med-icon--dna" viewBox="0 0 64 64" fill="none">
        <path
          d="M22 10 C38 22 26 32 42 44 C30 52 34 54 22 54"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M42 10 C26 22 38 32 22 44 C34 52 30 54 42 54"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M24 20 H40 M24 32 H40 M24 44 H40" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      </svg>
    </div>
  );
}

export default MedicalBackdropIcons;
