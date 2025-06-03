import React from 'react'
import { formatDNI } from '../../../../../../../services/utils'

export const Client = ({id, data}) => {
  return (
    <>
        <div>Owner</div>
        <div>{formatDNI(data?.vehicle?.owner?.id)}</div>
        <div>{`${data?.vehicle?.owner?.name} ${data?.vehicle?.owner?.lastname}`}</div>
    </>
  )
}
