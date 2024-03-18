'use client'

import useCurrentRole from '@@/src/hooks/use-current-role'

export default function AdminPage() {
  const role = useCurrentRole()

  return (
    <div>{role}</div>
  )
}

// este fichero es un ejemplo de como se veria la ruta capturando el role del usuario desde el cliente a traves del hook useCurrentRole
// al final la otra page tambien fue client :/
