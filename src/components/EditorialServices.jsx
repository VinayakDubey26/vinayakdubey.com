const SERVICES = [
  { number: "01", title: "Business software", body: "Custom tools, dashboards, inventory systems, and business applications shaped around your real workflows." },
  { number: "02", title: "Ecommerce platforms", body: "Distinctive storefronts and commerce experiences that make product discovery feel effortless." },
  { number: "03", title: "Operational systems", body: "Internal tools, workflow automation, and connected systems that bring clarity to daily operations." },
  { number: "04", title: "Websites", body: "Professional websites, portfolios, and business experiences with a clear point of view." },
];

const EditorialServices = () => (
  <section id="services" className="services-section section-dark" aria-labelledby="services-heading">
    <div className="page-width"><div className="section-intro section-intro--split"><div><p className="eyebrow">What I build</p><h2 id="services-heading">Useful software,<br /><em>beautifully made.</em></h2></div><p className="section-intro__copy">Good software makes a business feel lighter. I work across the interface, the data, and the architecture to make that happen.</p></div><div className="service-list">{SERVICES.map((service) => <a className="service-row" key={service.number} href="#contact"><span className="service-row__number">{service.number}</span><div className="service-row__body"><h3>{service.title}</h3><p>{service.body}</p></div><span className="service-row__action">Start a project <span aria-hidden="true">↗</span></span></a>)}</div></div>
  </section>
);

export default EditorialServices;
