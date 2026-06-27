import './Logo.css';

export default function Logo() {
  return (
    <div className="logo">
      <img
        src="/images/logo.png"
        alt="Pixel Panel"
        className="logo__icon logo__icon--full"
      />
    </div>
  );
}
