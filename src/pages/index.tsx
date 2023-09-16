import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import ReportIcon from '@mui/icons-material/Report';
// import { GetServerSideProps } from 'next';

const inter = Inter({ subsets: ['latin'] })
const taglines: CardProps[] = [
  {
    title: 'Bertemu',
    description: ''
  },
  {
    title: 'Berteman',
    description: ''
  },
  {
    title: 'Berbagi',
    description: ''
  }
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Pushakawan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            <ReportIcon style={{ marginRight: 5, color: 'red' }} />
            Tahap pengembangan
          </p>
          <div>

            <a
              href="https://beneranindonesia.id/"
              target="_blank"
              rel="noopener noreferrer"
              title="Beneran Indonesia"
            >
              By
              <Image
                src="/logo.svg"
                alt="BENI Logo"
                className={styles.vercelLogo}
                width={40}
                height={24}
                priority
              />
            </a>
          </div>
        </div>

        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/pusakawan.svg"
            alt="Pushakawan Logo"
            style={{ color: "#AE1622" }}
            width={1080}
            height={107}
            priority
          />
        </div>

        <div className={styles.grid}>
          {taglines.map((dt) => (
            <Card {...dt} key={dt.title} />
          ))}
        </div>
      </main>
    </>
  )
}

type CardProps = {
  title: string;
  description: string;
}

function Card({ title, description }: CardProps) {
  return (
    <div
      className={styles.card}
    >
      <h2>
        {title}
      </h2>
      <p>
        {description}
      </p>
    </div>
  );
}


export function getStaticProps({ locale }: { locale: "en" | "id" }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
    },
  };
}