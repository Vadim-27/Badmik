"use client";

import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <main className={styles.page} id="dashboard">
      <nav className={styles.breadcrumbs} aria-label="Хлібні крихти">
        <a href="#dashboard">Адмін</a>
        <span className={styles.sep}>/</span>
        <span aria-current="page">Дашборд</span>
      </nav>

      {/* KPI */}
      <section className={styles.kpiStrip} aria-label="Ключові показники">
        <div className={styles.kpi}>
          <div className={styles.label}>Тренування сьогодні</div>
          <div className={styles.value}>12</div>
          <div className={styles.sub}>+3 від вчора</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.label}>Заповнюваність</div>
          <div className={styles.value}>74%</div>
          <div className={styles.sub}>за останні 7 днів</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.label}>Нові гравці</div>
          <div className={styles.value}>9</div>
          <div className={styles.sub}>цього тижня</div>
        </div>
        <div className={styles.kpi}>
          <div className={styles.label}>Повернення</div>
          <div className={styles.value}>2</div>
          <div className={styles.sub}>за добу</div>
        </div>
      </section>

      {/* Cards */}
      <section className={styles.cards} aria-label="Огляд">
        <article className={styles.card}>
          <h3>Сьогоднішні тренування</h3>
          <div className={styles.list}>
            <div className={styles.row}>
              <div className={styles.left}>
                <strong>10:00–11:00</strong>
                <span className={`${styles.chip} ${styles.chipType}`}>Групове</span>
                <span className={`${styles.chip} ${styles.chipLevel}`}>Рівень B/C</span>
                <span className={`${styles.chip} ${styles.chipPrice}`}>₴250</span>
              </div>
              <div className={styles.right}>
                <div className={styles.meta}><span>Записані</span><span>8/12</span></div>
                <div className={styles.progress} aria-hidden="true"><span style={{width:"66%"}} /></div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <strong>12:00–13:00</strong>
                <span className={`${styles.chip} ${styles.chipType}`}>Індивідуальне</span>
                <span className={`${styles.chip} ${styles.chipLevel}`}>Рівень A</span>
                <span className={`${styles.chip} ${styles.chipPrice}`}>₴400</span>
              </div>
              <div className={styles.right}>
                <div className={styles.meta}><span>Записані</span><span>1/1</span></div>
                <div className={styles.progress} aria-hidden="true"><span style={{width:"100%"}} /></div>
              </div>
            </div>
          </div>
        </article>

        {/* Past */}
        <article className={styles.card}>
          <h3>Останні минулі тренування</h3>
          <div className={styles.list}>
            <div className={styles.row}>
              <div className={styles.left}>
                <strong>Вчора · 19:00–20:30</strong>
                <span className={`${styles.chip} ${styles.chipType}`}>Групове</span>
                <span className={`${styles.chip} ${styles.chipLevel}`}>Рівень B/C</span>
                <span className={`${styles.chip} ${styles.chipStatus}`}>Завершено</span>
                <span className={`${styles.chip} ${styles.chipPrice}`}>₴250</span>
              </div>
              <div className={styles.right}>
                <div className={styles.meta}><span>Було</span><span>10/12</span></div>
                <div className={styles.progress} aria-hidden="true"><span style={{width:"83%"}} /></div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <strong>Пн · 18:00–19:00</strong>
                <span className={`${styles.chip} ${styles.chipType}`}>Групове</span>
                <span className={`${styles.chip} ${styles.chipLevel}`}>Рівень C</span>
                <span className={`${styles.chip} ${styles.chipCancel}`}>Скасовано</span>
                <span className={`${styles.chip} ${styles.chipPrice}`}>₴200</span>
              </div>
              <div className={styles.right}>
                <div className={styles.meta}><span>Було</span><span>0/12</span></div>
                <div className={styles.progress} aria-hidden="true"><span style={{width:"0%"}} /></div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
