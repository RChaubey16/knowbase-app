'use server'

import { cookies } from 'next/headers'

export async function setOrganisationCookie(orgId: string) {
  (await cookies()).set({
    name: 'X-Organisation',
    value: orgId,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}
