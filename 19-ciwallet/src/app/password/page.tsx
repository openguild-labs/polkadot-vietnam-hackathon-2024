"use client"
import { Container } from "@/components"
import { usePasswordFormik, useRouterWithSearchParams } from "@/hooks"
import { Button, Input, Link, Spacer } from "@nextui-org/react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import { constantConfig } from "@/config"

const Page = () => {
    const formik = usePasswordFormik()
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouterWithSearchParams()
    return (
        <Container centerContent hasPadding>
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="w-full">
                <div className="text-2xl font-bold">Input your password</div>
                <Spacer y={6} />
                <div>
                    <Input
                        id="password"
                        label=""
                        size="lg"
                        labelPlacement="outside"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.password && formik.errors.password)}
                        errorMessage={formik.touched.password && formik.errors.password}
                        type={isVisible ? "text" : "password"}
                        endContent={<Link type="button" color="foreground" as="button" onPress={() => setIsVisible(!isVisible)}>
                            {
                                isVisible ?
                                    <EyeIcon className="w-5 h-5"/>
                                    : <EyeSlashIcon className="w-5 h-5"/>
                            }</Link>}
                    />
                    <Spacer y={1.5}/>
                    <Link  type="button" as="button" size="sm" onPress={() => router.push(constantConfig().path.mnemonicInput)}>Forgot Password?</Link>
                </div>
                
                <Spacer y={6} />
                <Button fullWidth color="primary" type="submit">
          Continue
                </Button>
            </form>
        </Container>
    )
}

export default Page
