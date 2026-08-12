import { FamilyPreview } from "./FamilyPreview/FamilyPreview";
import { FuturePreview } from "./FuturePreview/FuturePreview";
import { LifestyleCTA } from "./LifestyleCTA/LifestyleCTA";
import { LifestyleMessage } from "./LifestyleMessage/LifestyleMessage";
import { ShoppingPreview } from "./ShoppingPreview/ShoppingPreview";
import { TravelPreview } from "./TravelPreview/TravelPreview";

import styles from "./styles/LifestylePreview.module.scss";

export const LifestylePreview = () => {
  return (
    <section className={styles.preview}>
      <TravelPreview />
      <ShoppingPreview />
      <FamilyPreview />
      <FuturePreview />

       <LifestyleCTA />

       <LifestyleMessage />
    </section>
  );
};