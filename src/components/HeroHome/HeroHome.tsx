import { HeroContent } from "./HeroContent/HeroContent";
import { FinancePreview } from "./FinancePreview/FinancePreview";

import styles from "./styles/HeroHome.module.scss";

export const HeroHome = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__container}>
        <HeroContent />

        <FinancePreview />
      </div>
    </section>
  );
};