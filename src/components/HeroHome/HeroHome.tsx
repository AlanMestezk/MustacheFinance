import { HeroContent } from "./HeroContent/HeroContent";
import { FinancePreview } from "./FinancePreview/FinancePreview";

import styles from "./styles/HeroHome.module.scss";
import { LifestylePreview } from "./LifeStylePreview/LifestylePreview";
import { FAQPreview } from "./FAQPreview/FAQPreview";


export const HeroHome = () => {
  return (
    <section className={styles.hero}>

      <div className={styles.hero__container}>
        <HeroContent />

        <FinancePreview />
      </div>

      <LifestylePreview />

      <FAQPreview/>


    </section>
  );
};