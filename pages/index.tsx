import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Show from '../components/Show'

const Home: NextPage = () => {
  return (
    <div className='mx-auto max-w-7xl'>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Show />
    </div>
  )
}

export default Home
