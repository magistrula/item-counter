import React from 'react';

import Head from 'next/head';
import Counter from 'app/components/Counter';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Item Counter</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <main>
        <Counter />
      </main>
    </div>
  );
}
