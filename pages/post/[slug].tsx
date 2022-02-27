import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../typing'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
interface Props {
  post: Post
}
function Post({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()
  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="object-cover w-full h-40"
      />
      <article className="max-w-3xl p-5 mx-auto space-y-3">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-300">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props: any) => {
                ;<h1 className="my-5 text-2xl font-bold" {...props} />
              },
              h2: (props: any) => {
                ;<h1 className="my-5 text-xl font-bold" {...props} />
              },
              li: ({ children }: any) => {
                ;<li className="ml-4 list-disc"> {children}</li>
              },
              link: ({ href, children }: any) => {
                ;<a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              },
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg mx-auto my-5 border border-yellow-500" />

      <form className="flex flex-col max-w-2xl p-5 mx-auto my-10 mb-10">
        <h3 className="text-sm text-yellow-500">Enjoy this article?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below</h4>
        <hr className="py-3 mt-2" />

        <input type="hidden" {...register('_id')} name="_id" value={post._id} />
        <label className="block mb-5 ">
          <span className="text-gray-700">Name</span>
          <input
            {...register('name', { required: true })}
            type="text"
            placeholder="Want to know you opinion "
            className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-yellow-500 focus:ring"
          />
        </label>
        <label className="block mb-5 ">
          <span className="text-gray-700">Email</span>
          <input
            {...register('email', { required: true })}
            type="text"
            placeholder="Want to know you opinion "
            className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none form-input ring-yellow-500 focus:ring"
          />
        </label>
        <label className="block mb-5 ">
          <span className="text-gray-700">Comments</span>
          <textarea
            {...register('comment', { required: true })}
            placeholder="know sometings"
            rows={8}
            className="w-full px-3 py-2 mt-1 border rounded shadow outline-none form-textarea ring-yellow-500 focus:ring "
          />
        </label>
      </form>
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
        _createdAt,
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
