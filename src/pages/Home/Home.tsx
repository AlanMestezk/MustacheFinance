import { FooterHome } from "../../components/FooterHome/FooterHome";
import { HeaderHome } from "../../components/HeaderHome/HeaderHome";
import { HeroHome } from "../../components/HeroHome/HeroHome";
import { MobileHome } from "../../components/MobileHome/MobileHome";
import styles from "./styles/Home.module.scss";

export const Home = () => {
  return (
    <>
      <div className={styles.desktopHome}>
        <HeaderHome />
        <HeroHome />
        <FooterHome />
      </div>

      <div className={styles.mobileHome}>
        <MobileHome />
      </div>
    </>
  );
};