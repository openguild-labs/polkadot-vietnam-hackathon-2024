import React from 'react'
import ShitCoffee from '@/assets/bahroo-hacker.gif'
import ShitFire from '@/assets/angry-cat.gif'
import Image from 'next/image'

export default function HeroImage() {
    return (
        <Image src={ShitCoffee} alt="Shit Coffee" />
    )
}

export function HeroImage2() {
    return (
        <Image src={ShitFire} alt="Shit Fire" />
    )
}