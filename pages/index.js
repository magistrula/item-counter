import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Head from 'next/head'
import Link from 'next/link';
import OrderCounter from '../components/counter';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Item Counter</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <main>
        <OrderCounter />
      </main>
    </div>
  )
}
