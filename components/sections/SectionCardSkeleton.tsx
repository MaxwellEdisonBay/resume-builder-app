import { Card, CardContent } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import React from 'react'

const SectionCardSkeleton = () => {
  return (
    <Card className='w-3/4'>
        {/* <CardTitle>Test</CardTitle> */}
        {/* <CardHeader></CardHeader> */}
        <CardContent className='h-full pt-6'>
            <div className='flex flex-col items-center gap-4 w-full h-full'>
            <Skeleton className="h-full w-full" />
      <div className="flex flex-col gap-2 w-full">
      <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
            </div>
      
        </CardContent>
    </Card>
  )
}

export default SectionCardSkeleton