import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../typing'
interface Props {
  post: Post
}
function Post({ post }: Props) {
  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="object-cover w-full h-40"
      />
      <article>
        <h1>{post.title}</h1>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `
  *[_type == 'post']{
        _id,
        slug{
            current
        }
    }`
  const posts = await sanityClient.fetch(query)
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post'&&slug.current == $slug][0]{
        _id,
        _createAt,
        title,
        author->{
        name,
        image
      },
        description,
        mainImage,
        slug,
        body
      }`
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      post,
    },
    revalidate: 60, //after 60 sec will re update
  }
}
