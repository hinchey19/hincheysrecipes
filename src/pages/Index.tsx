import { ArrowUpRight, Check, ChevronRight, Menu, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

const coverage = [
  { title: "Commercial property", copy: "Protect the places, equipment, and assets that keep your business moving." },
  { title: "General liability", copy: "Coverage that helps you confidently take on customers, clients, and contracts." },
  { title: "Professional liability", copy: "A thoughtful layer of protection for the advice and expertise you provide." },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="site-shell">
      <div className="announcement">Independent advice for the way you do business <span>•</span> Serving businesses across California</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Hinchey Insurance home">
          <span className="brand-mark">H</span>
          <span>Hinchey <em>Insurance</em></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><Menu size={21} /></button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          <a href="#approach">Our approach</a>
          <a href="#coverage">Business coverage</a>
          <a href="#about">About us</a>
          <a className="nav-cta" href="#contact">Start a conversation <ArrowUpRight size={16} /></a>
        </nav>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> Independent, on your side</p>
          <h1>Better coverage.<br /><i>Clearer confidence.</i></h1>
          <p className="hero-intro">Insurance should help you move forward, not hold you back. Hinchey Insurance brings smart, personal guidance to the businesses building what comes next.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">Talk with a broker <ArrowUpRight size={17} /></a>
            <a className="text-link" href="#coverage">Explore coverage <ChevronRight size={17} /></a>
          </div>
          <div className="hero-note"><ShieldCheck size={17} /> Independent access to leading carriers</div>
        </div>
        <div className="hero-art" aria-label="Abstract layered illustration representing protection" role="img">
          <div className="art-circle art-circle-back" /><div className="art-circle art-circle-mid" /><div className="art-circle art-circle-front"><span>HI</span></div>
          <div className="art-label label-one">Built around<br /><strong>your business</strong></div>
          <div className="art-label label-two">01 <span>—</span> Protection, with perspective</div>
        </div>
      </section>

      <section id="approach" className="statement-section">
        <div className="section-kicker">Why Hinchey</div>
        <div><h2>Insurance is personal<br />when <i>business</i> is personal.</h2><p>We take time to understand the full picture: where you are today, where you are headed, and what could get in the way. Then we make the complex feel simple.</p></div>
      </section>

      <section id="coverage" className="coverage-section">
        <div className="section-heading"><div><div className="section-kicker">Coverage, considered</div><h2>Protection for the<br /><i>work you’re proud of.</i></h2></div><p>From your first policy to your next chapter, we help you make confident decisions about the risks that matter most.</p></div>
        <div className="coverage-grid">{coverage.map((item, index) => <article className="coverage-card" key={item.title}><span className="card-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.copy}</p><a href="#contact" aria-label={`Learn about ${item.title}`}>Learn more <ArrowUpRight size={16} /></a></article>)}</div>
      </section>

      <section id="about" className="about-section"><div className="about-accent"><Sparkles size={22} /><span>More than a policy.<br /><strong>A relationship.</strong></span></div><div><div className="section-kicker">A broker who listens</div><h2>Good advice starts<br />with a good <i>conversation.</i></h2><p>We’re here to translate the fine print, ask the next question, and be a steady partner through every season of your business.</p><a className="text-link dark-link" href="#contact">Meet Hinchey Insurance <ArrowUpRight size={17} /></a></div></section>

      <section id="contact" className="contact-section"><div><div className="section-kicker">Let’s talk business</div><h2>Ready for coverage<br />that keeps <i>up?</i></h2></div><div className="contact-right"><p>Tell us a little about what you’re building. We’ll be in touch with a thoughtful next step.</p><a className="button button-light" href="mailto:hello@hincheyinsurance.com">Start a conversation <ArrowUpRight size={17} /></a><div className="contact-details"><span>hello@hincheyinsurance.com</span><span>California · By appointment</span></div></div></section>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">H</span><span>Hinchey <em>Insurance</em></span></a><span>Independent insurance for independent businesses.</span><span>© 2026 Hinchey Insurance</span></footer>
    </main>
  );
};

export default Index;
