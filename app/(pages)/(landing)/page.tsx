"use client"; // This directive enables client-side rendering for this component
import { FC } from 'react';
import Head from 'next/head';
import styles from './Home.module.css';
import Link from 'next/link';

const Home: FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Movie Matcher</title>
        <meta name="description" content="Make movie selection quick, enjoyable, and stress-free." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Movie Matcher
        </h1>

        <section className={styles.section}>
          <h2>Why Movie Matcher?</h2>
          <p>
            Struggling to decide what movie to watch next? You're not alone. With countless options on platforms like Netflix, Amazon Prime, and others, decision fatigue and choice overload can make movie night a chore.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Our Solution</h2>
          <p>
            Movie Matcher simplifies the movie selection process with personalized recommendations and interactive features:
          </p>
          <ul>
            <li>Mood-based quizzes to suggest the perfect movie for any occasion.</li>
            <li>Swipe-based selections to quickly browse and choose movies.</li>
            <li>Collaborative tools to decide together with friends and family.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>How It Works</h2>
          <p>
            Just answer a few questions, swipe through curated options, and let our app do the rest. Whether you're in the mood for a thriller, comedy, or classic, Movie Matcher has got you covered.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Get Started</h2>
          <p>
            Ready to make your movie night stress-free and enjoyable? Download Movie Matcher now and discover the perfect movie effortlessly!
          </p>
          <Link href="/swiper">
          <button className={styles.button}>Start Now</button></Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Movie Matcher. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
