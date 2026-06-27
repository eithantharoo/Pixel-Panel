import { sidebarIcons } from '../../assets/images';

export default function IconSwap({ iconKey, alt, className = '' }) {
  const pair = sidebarIcons[iconKey];
  if (!pair) return null;

  return (
    <span className={`icon-swap ${className}`}>
      <img src={pair.default} alt={alt} className="icon-default" />
      <img src={pair.hover}   alt="" aria-hidden="true" className="icon-hover" />
    </span>
  );
}
