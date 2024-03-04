import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface FormErrorProps {
  message: string | undefined
}

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className='flex items-center bg-destructive/15 p-3 rounded-md gap-x-2 text-sm text-destructive'>
      <ExclamationTriangleIcon className='w-4 h-4' />
      <span>{message}</span>
    </div>
  )
}
