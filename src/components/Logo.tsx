import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
}

/**
 * Heureka Tx brand symbol, traced from the official Symbol - White.svg.
 */
export const DeltaIcon: React.FC<IconProps> = ({
  className = "h-8 w-8",
  primaryColor = "currentColor",
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 161.2 141.22"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    >
      <path
        fill={primaryColor}
        d="M160.37,132.06L85.89,3.05c-2.35-4.07-8.23-4.07-10.58,0L.83,132.06c-2.35,4.07.59,9.16,5.29,9.16h21.66c2.18,0,4.2-1.16,5.29-3.05l53.6-92.84c2.35-4.07,8.23-4.07,10.58,0l47.26,81.85c.7,1.22-.18,2.74-1.58,2.74h-66.26c-2.18,0-4.2,1.16-5.29,3.05l-4.76,8.25h88.46s0,0,0,0,0,0,0,0h0c4.7,0,7.64-5.09,5.29-9.16Z"
      />
    </svg>
  );
};

/**
 * Delta symbol with the coral/pink Tx superscript.
 */
export const DeltaTxIcon: React.FC<IconProps> = ({
  className = "h-10 w-10",
  primaryColor = "currentColor",
  accentColor = "#f2668b", // official Heureka Tx brand pink
  ...props
}) => {
  return (
    <div className="relative inline-block">
      <DeltaIcon className={className} primaryColor={primaryColor} {...props} />
      <span
        className="absolute bottom-1 -right-2 font-sans font-medium text-xs tracking-tight"
        style={{ color: accentColor }}
      >
        Tx
      </span>
    </div>
  );
};

/**
 * Official Heureka Tx horizontal logo (traced from Logo - White.svg).
 */
export const HeurekaLogo: React.FC<IconProps & { forceLight?: boolean }> = ({
  className = "h-8",
  primaryColor = "white", // default white since page is premium dark mode
  accentColor = "#f2668b", // official Heureka Tx brand pink
  forceLight = false,
  ...props
}) => {
  const actualPrimary = forceLight ? "#090b11" : primaryColor;

  return (
    <svg
      viewBox="0 0 795.86 174.85"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} cursor-pointer select-none`}
      referrerPolicy="no-referrer"
      {...props}
    >
      <path
        fill={actualPrimary}
        d="M160.37,132.06L85.89,3.05c-2.35-4.07-8.23-4.07-10.58,0L.83,132.06c-2.35,4.07.59,9.16,5.29,9.16h21.66c2.18,0,4.2-1.16,5.29-3.05l53.6-92.84c2.35-4.07,8.23-4.07,10.58,0l47.26,81.85c.7,1.22-.18,2.74-1.58,2.74h-66.26c-2.18,0-4.2,1.16-5.29,3.05l-4.76,8.25h88.46s0,0,0,0,0,0,0,0h0c4.7,0,7.64-5.09,5.29-9.16Z"
      />
      <text
        fill={actualPrimary}
        fontFamily="Aspekta-400, Aspekta, var(--font-sans)"
        fontSize="141.44"
        transform="translate(176.46 141.47)"
      >
        <tspan x="0" y="0">Heureka</tspan>
      </text>
      <text
        fill={accentColor}
        fontFamily="Aspekta-600, Aspekta, var(--font-sans)"
        fontWeight="600"
        fontSize="60.13"
        transform="translate(726.11 141.03)"
      >
        <tspan x="0" y="0">Tx</tspan>
      </text>
    </svg>
  );
};
