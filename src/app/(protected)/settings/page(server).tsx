import { auth, signOut } from '@/auth'

export default async function SettingsPage() {
  const session = await auth()

  const handleSignOut = async () => {
    'use server'
    await signOut()
  }

  return (
    <div className='h-full bg-stone-800 w-full text-center text-white text-2xl'>
      <h2>🔽 Objeto session de auth() 🔽</h2>
      <p>{JSON.stringify(session)}</p>

      <form action={handleSignOut}>
        <button className='bg-stone-600 p-2 rounded-lg text-lg'>Sign out</button>
      </form>
    </div>
  )
}

// # este fichero fue el primer ejemplo de /settings en donde simplemente capturamos los datos de la sesion por medio de auth() de @/auth y los mostramos en pantalla
