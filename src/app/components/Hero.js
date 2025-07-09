import Link from 'next/link'
import React from 'react'

const Hero = () => {
    return (
        <div>


            <section className="bg-gradient-to-l from-gray-800 via-slate-900 to-gray-900 w-full h-screen flex justify-center items-center">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                    <Link href="/service" className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                        <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span> <span className="text-sm font-medium">ExoLead: Tool which filters high value leads from rest</span>

                    </Link>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Find the Right Leads, Right Now</h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">AI-inspired lead scoring tool that helps you identify your most promising prospects in seconds. By analyzing job titles, roles, and company relevance, it ranks your leads so you can focus on what really matters</p>
                    <div className=" w-full  flex justify-center items-center">
                        <label for="default-email" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Let&apos;s explore</label>
                        <Link href="/service">
                            <button className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Let&apos;s explore</button>

                        </Link>
                    </div>
                </div>
                <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
            </section>

        </div>
    )
}

export default Hero
