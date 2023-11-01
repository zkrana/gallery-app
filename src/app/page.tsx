import Image from 'next/image'
import Gallery from './comonents/Gallery'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-6 px-5 md:p-14 lg:p-24">
        <Gallery />
    </main>
  )
}
