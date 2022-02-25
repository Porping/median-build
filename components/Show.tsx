import React from 'react'

function Show() {
    return (
        <div className='flex items-center justify-between py-10 border-black border-y bg-cyan-400 '>
            <div className='px-10 space-y-5'>
                <h1 className='font-serif text-6xl max-w-sl'><span className='underline decoration-black decoration-4'>PorPing</span> is a place to write , read, and connect</h1>
                <h2>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum aliquid optio earum eos sint iusto nisi alias id quisquam porro.</h2>
            </div>
            <img src="/logo-container.png" alt="" className='relative hidden mx-5 lg:mx-10 h-28 md:inline-flex lg:h-64' />
        </div>
    )
}

export default Show