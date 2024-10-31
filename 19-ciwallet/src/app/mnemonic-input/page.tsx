"use client"
import { Container } from "@/components"
import { constantConfig } from "@/config"
import { useRouterWithSearchParams } from "@/hooks"
import { useMnemonicInputFormik } from "@/hooks/formiks/useMnemonicInputFormik"
import { Button, Spacer, Textarea, Link } from "@nextui-org/react"
import React from "react"

const Page = () => {
    const formik = useMnemonicInputFormik()
    const router = useRouterWithSearchParams()

    return (
        <Container centerContent hasPadding>
            <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="w-full">
                <div className="w-full">
                    <div className="text-2xl font-bold">Input your mnemonic</div>
                    <Spacer y={6} />
                    <Textarea
                        id="mnemonic"
                        label=""
                        size="lg"
                        labelPlacement="outside"
                        value={formik.values.mnemonic}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.touched.mnemonic && formik.errors.mnemonic)}
                        errorMessage={formik.touched.mnemonic && formik.errors.mnemonic}
                    />
                    <Spacer y={1.5} />
                    <Link size="sm" as="button" onPress={() => router.push(constantConfig().path.mnemonic)}>
                        <div className="text-sm">Create</div>
                    </Link>
                    <Spacer y={6} />
                    <Button type="submit" fullWidth color="primary">Import</Button>
                </div>
            </form>
        </Container>
    )
}

export default Page