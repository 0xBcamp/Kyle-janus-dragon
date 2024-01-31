import { Inter } from 'next/font/google'
import SignupPage from './components/Signup_Page'
import Navbar from './components/Navbar'
import Image from 'next/image'
import Home_Page from './components/Home_Page'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Home_Page/>
    </main>
  )
}
