import FiltersBar from "./FiltersBarComponent/FiltersBar";
import css from "./FiltersBarSection.module.scss";

export default function FiltersBarSection() {
  return (
    <section className={`${css.sectionFilterBar} `}>
      <h2 className={css.titleFilterBar}>Оберіть клуб та починайте улюблені заняття</h2>
      <FiltersBar />
    </section>
  );
}
