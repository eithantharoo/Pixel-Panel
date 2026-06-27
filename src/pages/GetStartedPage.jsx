import { useNavigate } from 'react-router-dom';
import './GetStartedPage.css';

const MANGA_COVERS = [
  '/images/childhood_friend_complex.jpg',
  '/images/dark_moon.jpg',
  '/images/demon_slayer.jpg',
  '/images/little_mushroom.jpg',
  '/images/solo_leveling.jpg',
  '/images/tears_on_a_withered_flower.jpg',
  '/images/this_villlainess_wants_a_divorce.jpg',
  '/images/villians_are_destined_to_die.jpg',
  '/images/hidden_love.jpg',
  '/images/accidental_love.jpg',
  '/images/magic_emperor.jpg',
  '/images/prison_lab.jpg',
];

export default function GetStartedPage() {
  const navigate = useNavigate();

  return (
    <div className="get-started">
      <section className="get-started__content">
        <h1>What do you want to read?</h1>
        <p>
          Pick a few genres and types that excite you. We&apos;ll personalize your
          Story Hub just for you.
        </p>
        <button type="button" className="get-started__cta" onClick={() => navigate('/interests')}>
          Get Started <span aria-hidden="true">→</span>
        </button>
      </section>

      <section className="get-started__visual" aria-hidden="true">
        <div className="get-started__grid-wrap">
          <div className="get-started__grid">
            {MANGA_COVERS.map((src, index) => (
              <div key={`${src}-${index}`} className="get-started__cover">
                <img
                  src={src}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.classList.add('get-started__cover--fallback');
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
