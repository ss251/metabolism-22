import type { NextPage } from 'next'
import Head from 'next/head'
import { Header } from '../components/Header'

const Home: NextPage = () => {
  return (
    <div className='flex flex-col justify-center h-screen min-h-screen bg-transparent'>
      <Header />
      <main className="flex flex-col items-center">        
        <h1 className="text-white">
          {'<<< ZORA >>>'}
        </h1>
      </main>
    </div>
  )
}

export default Home
