import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { BackButton, Header, Social } from '@/components'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  bachButtonHref: string
  showSocial?: boolean
}
export default function CardWrapper({
  children, headerLabel, backButtonLabel, bachButtonHref, showSocial
}: CardWrapperProps) {
  return (
    <Card className='w-[400px] shadow-md border'>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>

      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton label={backButtonLabel} href={bachButtonHref}/>
      </CardFooter>
    </Card>
  )
}
