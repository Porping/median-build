import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Show from '../components/Show'
import { sanityCLient, urlFor } from '../sanity'
import { Post } from './typing'

interface Props {
  posts: [Post];
}

const Home: NextPage = ({ posts }: Props) => {
  console.log(posts)
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


export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    slug,
    author->{
    name,
    image
  },
  description,
  mainImage,
  }`;

  const posts = await sanityCLient.fetch(query);

  return {
    props: {
      posts
    }
  }
}