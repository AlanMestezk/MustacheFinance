import { FooterBrand } from "./FooterBrand/FooterBrand";
import { FooterNavigation } from "./FooterNavigation/FooterNavigation";

import styles from "./styles/FooterHome.module.scss";

export const FooterHome = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <FooterBrand />

        <FooterNavigation />
      </div>
    </footer>
  );
};