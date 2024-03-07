import { auth, signOut } from '@/auth'

export default async function SettingsPage() {
  const session = await auth()

  const handleSignOut = async () => {
    'use server'
    await signOut()
  }

  return (
    <div className='h-full bg-stone-800 w-full text-center text-white text-2xl'>
      <h2>Usuario</h2>
      <p>{session?.user?.name}</p>

      <form action={handleSignOut}>
        <button className='bg-stone-600 p-2 rounded-lg text-lg'>Sign out</button>
      </form>
    </div>
  )
}
