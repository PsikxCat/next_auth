'use server'

import { signOut } from '@/auth'

export const logout = async () => {
  // podemos realizar acciones en el servidor antes de cerrar la sesion
  await signOut()
}

// ejemplo de server action para logout en CSR component
