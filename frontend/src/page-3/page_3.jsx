import React from 'react';
import './page_3.css';

const COMIC_COVERS = [
  { id: 1, title: 'Accidental Love', image: '/images/accidental_love.jpg' },
  { id: 2, title: 'Childhood Friend Complex', image: '/images/childhood_friend_complex.jpg' },
  { id: 3, title: 'Dark Moon', image: '/images/dark_moon.jpg' },
  { id: 4, title: 'Demon Slayer', image: '/images/demon_slayer.jpg' },
  { id: 5, title: 'Hidden Love', image: '/images/hidden_love.jpg' },
  { id: 6, title: 'Prison Lab', image: '/images/prison_lab.jpg' },
  { id: 7, title: 'Little Mushroom', image: '/images/little_mushroom.jpg' },
  { id: 8, title: 'Magic Emperor', image: '/images/magic_emperor.jpg' },
  { id: 9, title: 'Villians are destined to die', image: '/images/villians_are_destined_to_die.jpg' },
];

export default function StoryHubLanding() {
  return (
    <div className="landing-container">
      {/* Left Content Column */}
      <div className="content-side">
        <h1 className="main-heading">
          What do you <br /> want to read?
        </h1>
        <p className="sub-heading">
          Pick a few genres and types that excite you. We'll personalize your Story Hub just for you.
        </p>
        <button className="get-started-btn">
          Get Started 
          <span className="arrow-icon">→</span>
        </button>
      </div>

      {/* Right Tilted Art Wall Column */}
      <div className="art-side">
        <div className="tilted-grid">
          {/* Column 1 */}
          <div className="grid-column drop-down">
            {COMIC_COVERS.slice(0, 3).map((cover) => (
              <div key={cover.id} className="cover-card">
                <img src={cover.image} alt={cover.title} />
              </div>
            ))}
          </div>
          
          {/* Column 2 */}
          <div className="grid-column drop-up">
            {COMIC_COVERS.slice(3, 6).map((cover) => (
              <div key={cover.id} className="cover-card">
                <img src={cover.image} alt={cover.title} />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="grid-column drop-down">
            {COMIC_COVERS.slice(6, 9).map((cover) => (
              <div key={cover.id} className="cover-card">
                <img src={cover.image} alt={cover.title} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}