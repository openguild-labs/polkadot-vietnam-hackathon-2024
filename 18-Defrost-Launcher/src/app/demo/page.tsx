'use client'

import React from 'react'

import { signIn, signOut } from 'next-auth/react'

export default function Demo() {
  return (
    <div>
      <button onClick={() => signIn('google')}>Google signin</button>
      <button onClick={() => signIn('twitter')}>Twitter signin</button>
      <button onClick={() => signIn('facebook')}>Facebook signin</button>
    </div>
  )
}