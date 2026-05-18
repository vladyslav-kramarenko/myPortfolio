import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>
        © {new Date().getFullYear()} Vladyslav Kramarenko
        <span className={styles.sep}>·</span>
        <Link href="/404" className={styles.statusLink}>
          <span className={styles.statusDot} />
          all systems operational
        </Link>
      </p>
    </footer>
  );
}
