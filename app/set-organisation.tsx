'use client'

import { useEffect } from 'react'
import { setOrganisationCookie } from './actions/setOrganisation'


export default function SetOrganisation({ orgId }: { orgId: string }) {
  useEffect(() => {
    setOrganisationCookie(orgId)
  }, [])

  return null
}
