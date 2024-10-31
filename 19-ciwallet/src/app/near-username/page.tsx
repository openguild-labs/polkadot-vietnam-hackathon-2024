"use client"
import { Container } from "@/components"
import { constantConfig, envConfig } from "@/config"
import { useCreatePasswordFormik, useRouterWithSearchParams } from "@/hooks"
import { useAppSelector } from "@/redux"
import { nearClient } from "@/services"
import { TIME_OUT } from "@/utils"
import { Button, Input, Spacer } from "@nextui-org/react"
import React, { useEffect, useState } from "react"

const Page = () => {
    const formik = useCreatePasswordFormik()
    const router = useRouterWithSearchParams()
    const network = useAppSelector((state) => state.blockchainReducer.network)
    const baseAccountId = envConfig().nearAccountIds[network]
    const accountId = `${formik.values.nearUsername}.${baseAccountId}`

    //state to check if the account existed
    const [existed, setExisted] = useState(false)
    //useEffect to make sure the account not existed
    useEffect(() => {
        const handleEffect = async () => {
            try {
                const client = await nearClient(network)
                const account = await client.account(accountId)
                await account.state()
                setExisted(true)
            } catch (ex) {
                console.log(ex)
                setExisted(false)
            }
        }
        const delayedFn = setTimeout(handleEffect, TIME_OUT)
        return () => clearTimeout(delayedFn)
    }, [formik.values.nearUsername])

    return (
        <Container centerContent hasPadding>
            <div className="w-full">
                <div className="text-2xl font-bold">Resevere NEAR account ID</div>
                <Spacer y={6} />
                <Input
                    id="nearUsername"
                    label=""
                    size="lg"
                    endContent={
                        <div className="text-foreground-400">.{baseAccountId}</div>
                    }
                    labelPlacement="outside"
                    value={formik.values.nearUsername}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                        !!(
                            formik.touched.nearUsername &&
              (existed || formik.errors.nearUsername)
                        )
                    }
                    errorMessage={
                        formik.touched.nearUsername &&
            (formik.errors.nearUsername ||
              `Account ${formik.values.nearUsername}.${baseAccountId} already existed`)
                    }
                />
                <Spacer y={1.5} />
                <div className="text-xs text-foreground-400">
          NEAR is a special blockchain that allows the use of readable
          addresses.
                </div>
                <Spacer y={6} />
                <Button
                    fullWidth
                    color="primary"
                    onPress={() => router.push(constantConfig().path.createPassword)}
                >
          Continue
                </Button>
            </div>
        </Container>
    )
}

export default Page
