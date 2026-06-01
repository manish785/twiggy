import logoUrl from "url:../../assets/logo.svg";

const SIZES = {
  sm: "h-9 w-9",
  md: "h-10 w-10 sm:h-12 sm:w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

/** FoodHeaven brand mark (bundled SVG). */
const BrandLogo = ({
  size = "md",
  className = "",
  showRing = true,
}) => {
  const sizeClass = SIZES[size] || SIZES.md;
  const ringClass = showRing ? "ring-2 ring-brand-100" : "";

  return (
    <img
      src={logoUrl}
      alt="FoodHeaven"
      className={`${sizeClass} shrink-0 rounded-xl object-contain ${ringClass} ${className}`.trim()}
      width={size === "lg" || size === "xl" ? 80 : 48}
      height={size === "lg" || size === "xl" ? 80 : 48}
      decoding="async"
    />
  );
};

export { logoUrl };
export default BrandLogo;
