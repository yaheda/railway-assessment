"use client"

export function FloatingOrbitals() {
  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 opacity-50"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb5" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orb6" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Orbital system 1 - Primary color */}
      <g className="orbital-system">
        <circle
          cx="720"
          cy="450"
          r="200"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.05"
        />
        <g className="orbital-body orbital-1">
          <circle cx="920" cy="450" r="40" fill="url(#orb1)" />
        </g>
      </g>

      {/* Orbital system 2 - Accent color */}
      <g className="orbital-system">
        <circle
          cx="720"
          cy="450"
          r="320"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.03"
        />
        <g className="orbital-body orbital-2">
          <circle cx="1040" cy="450" r="50" fill="url(#orb2)" />
        </g>
      </g>

      {/* Orbital system 3 - Secondary color */}
      <g className="orbital-system">
        <circle
          cx="720"
          cy="450"
          r="140"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.03"
        />
        <g className="orbital-body orbital-3">
          <circle cx="860" cy="450" r="32" fill="url(#orb3)" />
        </g>
      </g>

      {/* Orbital system 4 - Secondary orbit */}
      <g className="orbital-system">
        <circle
          cx="720"
          cy="450"
          r="280"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.03"
        />
        <g className="orbital-body orbital-4">
          <circle cx="1000" cy="450" r="35" fill="url(#orb3)" />
        </g>
      </g>

      {/* Orbital system 5 - Small orbit */}
      <g className="orbital-system">
        <circle
          cx="720"
          cy="450"
          r="100"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.03"
        />
        <g className="orbital-body orbital-5">
          <circle cx="820" cy="450" r="25" fill="url(#orb2)" />
        </g>
      </g>

      {/* Large floating orbs for background depth */}
      <g className="floating-orbs">
        <circle
          cx="200"
          cy="150"
          r="80"
          fill="url(#orb1)"
          className="float-slow"
        />
        <circle
          cx="1250"
          cy="700"
          r="100"
          fill="url(#orb2)"
          className="float-slower"
        />
        <circle
          cx="150"
          cy="750"
          r="70"
          fill="url(#orb3)"
          className="float-medium"
        />
        <circle
          cx="1350"
          cy="200"
          r="60"
          fill="url(#orb4)"
          className="float-slow"
        />
      </g>

      {/* Medium floating orbs */}
      <g className="floating-orbs-medium">
        <circle
          cx="400"
          cy="300"
          r="45"
          fill="url(#orb2)"
          className="float-medium"
        />
        <circle
          cx="1100"
          cy="350"
          r="50"
          fill="url(#orb5)"
          className="float-slower"
        />
        <circle
          cx="600"
          cy="800"
          r="40"
          fill="url(#orb1)"
          className="float-slow"
        />
        <circle
          cx="950"
          cy="100"
          r="55"
          fill="url(#orb6)"
          className="float-medium"
        />
      </g>

      {/* Small floating orbs */}
      <g className="floating-orbs-small">
        <circle
          cx="300"
          cy="600"
          r="30"
          fill="url(#orb3)"
          className="float-slower"
        />
        <circle
          cx="1200"
          cy="450"
          r="28"
          fill="url(#orb4)"
          className="float-slow"
        />
        <circle
          cx="500"
          cy="200"
          r="25"
          fill="url(#orb2)"
          className="float-medium"
        />
        <circle
          cx="1100"
          cy="750"
          r="32"
          fill="url(#orb5)"
          className="float-slower"
        />
        <circle
          cx="700"
          cy="100"
          r="22"
          fill="url(#orb1)"
          className="float-slow"
        />
        <circle
          cx="400"
          cy="500"
          r="35"
          fill="url(#orb6)"
          className="float-medium"
        />
      </g>

      {/* Extra small floating orbs - additional layer */}
      <g className="floating-orbs-tiny">
        <circle
          cx="600"
          cy="150"
          r="20"
          fill="url(#orb4)"
          className="float-slow"
        />
        <circle
          cx="350"
          cy="250"
          r="18"
          fill="url(#orb5)"
          className="float-medium"
        />
        <circle
          cx="900"
          cy="650"
          r="22"
          fill="url(#orb6)"
          className="float-slower"
        />
        <circle
          cx="1300"
          cy="550"
          r="19"
          fill="url(#orb1)"
          className="float-medium"
        />
        <circle
          cx="250"
          cy="400"
          r="24"
          fill="url(#orb2)"
          className="float-slow"
        />
        <circle
          cx="1050"
          cy="200"
          r="21"
          fill="url(#orb3)"
          className="float-slower"
        />
      </g>

      {/* Additional medium-small orbs for density */}
      <g className="floating-orbs-varied">
        <circle
          cx="800"
          cy="250"
          r="38"
          fill="url(#orb1)"
          className="float-medium"
        />
        <circle
          cx="550"
          cy="450"
          r="42"
          fill="url(#orb2)"
          className="float-slow"
        />
        <circle
          cx="1150"
          cy="600"
          r="36"
          fill="url(#orb3)"
          className="float-slower"
        />
        <circle
          cx="420"
          cy="700"
          r="48"
          fill="url(#orb4)"
          className="float-medium"
        />
        <circle
          cx="1000"
          cy="800"
          r="40"
          fill="url(#orb5)"
          className="float-slow"
        />
        <circle
          cx="320"
          cy="100"
          r="45"
          fill="url(#orb6)"
          className="float-slower"
        />
        <circle
          cx="1300"
          cy="300"
          r="38"
          fill="url(#orb1)"
          className="float-medium"
        />
      </g>

      {/* Scattered tiny accent orbs */}
      <g className="floating-orbs-accent">
        <circle
          cx="450"
          cy="350"
          r="15"
          fill="url(#orb2)"
          className="float-slower"
        />
        <circle
          cx="750"
          cy="550"
          r="17"
          fill="url(#orb5)"
          className="float-slow"
        />
        <circle
          cx="280"
          cy="650"
          r="14"
          fill="url(#orb1)"
          className="float-medium"
        />
        <circle
          cx="1180"
          cy="350"
          r="16"
          fill="url(#orb4)"
          className="float-slow"
        />
        <circle
          cx="680"
          cy="750"
          r="18"
          fill="url(#orb3)"
          className="float-slower"
        />
        <circle
          cx="920"
          cy="300"
          r="15"
          fill="url(#orb6)"
          className="float-medium"
        />
        <circle
          cx="390"
          cy="150"
          r="16"
          fill="url(#orb2)"
          className="float-slow"
        />
        <circle
          cx="1080"
          cy="500"
          r="17"
          fill="url(#orb1)"
          className="float-slower"
        />
      </g>
    </svg>
  )
}
