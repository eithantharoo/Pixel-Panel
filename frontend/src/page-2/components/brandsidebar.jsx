import Logo from './logo';
import './brandsidebar.css';

export default function BrandSidebar() {
  return (
    <aside className="brand-sidebar">
      <Logo />
      <div className="brand-sidebar__illustrations" aria-hidden="true">
        <img src="/images/demon_slayer.png" alt="" className="book book--red" />
        <img src="/images/tears_on_a_withered_flower.png" alt="" className="book book--yellow" />
        <img src="/images/beloved_by_the_male_lead's_nephew.png" alt="" className="book book--stack" />
      </div>
    </aside>
  );
}