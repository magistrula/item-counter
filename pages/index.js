import React from 'react';

import Head from 'next/head';
import Counter from 'app/components/Counter';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Item Counter</title>
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
