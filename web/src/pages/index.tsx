import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImage from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios/axios'


interface HomeProps {
  poolCount: number
  betsCount: number
  usersCount: number
}

export default function Home({ poolCount, betsCount, usersCount }: HomeProps) {
  return (
    <div className='max-w-[1124px] h-screen mx-auto gap-28 grid grid-cols-2 items-center'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da Copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImage} alt="" />
          <strong className='text-gray-100'>
            <span className='text-ignite-500 text-xl'>+{usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-4'>
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm'
            type="text"
            placeholder='Qual o nome do seu bolão?'
            required
          />
          <button
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p 
          className='mt-4 text-sm text-gray-300 leading-relaxed'
        >
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between items-center text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'></div>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" />
            <div className='flex flex-col'>
                <span className='font-bold text-2xl'>+{betsCount}</span>
                <span>Palpites enviados</span>
              </div>
          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="" quality={100} />
    </div>
  )
}

export const getServerSideProps = async () => {
  const [
    poolCountResponse,
    betsCountResponse,
    usersCountResponse
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('bets/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      betsCount: betsCountResponse.data.count,
      usersCount:usersCountResponse.data.count
    }
  }
}
