import React from 'react'

const Blog = () => {
  return (
    <div>
          <section className="bg-white dark:bg-gray-900">
              <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                  <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                      <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Related Articles</h2>
                      <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">Learn more about lead Generation by information from online articles, blogs, and press releases.</p>
                  </div>
                  <div className="grid gap-8 lg:grid-cols-2">
                      <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-5 text-gray-500">
                              <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                  <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                  Article
                              </span>
                          </div>
                          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="https://www.salesforce.com/in/marketing/lead-generation-guide/">Lead Generation: A Complete Guide</a></h2>
                          <p className="mb-5 font-light text-gray-500 dark:text-gray-400">When you understand the basics of lead generation, you&apos;ll turn interest into conversions. Here&apos;s what you need to know.</p>
                          <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                  <span className="font-medium dark:text-white">
                                      Salesforce
                                  </span>
                              </div>
                              <a href="https://www.salesforce.com/in/marketing/lead-generation-guide/" className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                  Read more
                                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                              </a>
                          </div>
                      </article>


                      <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex justify-between items-center mb-5 text-gray-500">
                              <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                  <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path><path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path></svg>
                                  Article
                              </span>
                          </div>
                          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="https://www.leadfeeder.com/guides/lead-generation/">What is Lead Generation?</a></h2>
                          <p className="mb-5 font-light text-gray-500 dark:text-gray-400">Lead generation is vital for the growth of B2B businesses, enabling you to differentiate your brand, connect with potential customers, and guide them through their purchasing journey.</p>
                          <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                  <span className="font-medium dark:text-white">
                                      Leadfeeder
                                  </span>
                              </div>
                              <a href="https://www.leadfeeder.com/guides/lead-generation/" className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
                                  Read more
                                  <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                              </a>
                          </div>
                      </article>
                  </div>
              </div>
          </section>
    </div>
  )
}

export default Blog
