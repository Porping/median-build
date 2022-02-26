import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import Show from '../components/Show'
import { sanityClient, urlFor } from '../sanity'
import { Post } from './typing'

interface Props {
  posts: [Post]
}

const Home: NextPage = ({ posts }: Props) => {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <Show />
      {/* Posts */}
      <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
        {posts.map((post) => {
          return (
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className="overflow-hidden border rounded-lg cursor-pointer group">
                {post.mainImage && (
                  <img
                    src={urlFor(post.mainImage).url()!}
                    alt=""
                    className="object-cover w-full transition-transform duration-200 ease-in-out h-60 group-hover:scale-105 group-hover:opacity-90"
                  />
                )}
                <div className="flex justify-between p-5 bg-white">
                  <div>
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-sm">
                      {post.description} by {post.author.name}
                    </p>
                  </div>
                  <img
                    src={urlFor(post.author.image).url()!}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
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
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
