import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div>
            <h2 className={styles.logo}>Thoughtline</h2>
            <p className={styles.description}>
              แบ่งปันความรู้ ความคิด และแรงบันดาลใจ เพื่อสร้างสรรค์สิ่งใหม่ในโลกดิจิทัล
            </p>
          </div>
          
          <div className={styles.copyright}>
            &copy; PPWSID {new Date().getFullYear()} Thoughtline. All right reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
