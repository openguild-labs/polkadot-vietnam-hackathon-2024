"use client"

import React from "react"
import {
    useCreateAccountFormik,
    useCreateAccountModalDisclosure,
} from "@/hooks"
import { Button, Input, Spacer, Image } from "@nextui-org/react"

export const GenerateTab = () => {
    const formik = useCreateAccountFormik()
    const { onClose } = useCreateAccountModalDisclosure()
    return (
        <div>
            <Input
                id="accountNumber"
                label="Account Number"
                placeholder="Input account number here"
                description="Left account number blank to generate a new account number"
                labelPlacement="outside"
                value={formik.values.accountNumber?.toString()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                    !!(formik.touched.accountNumber && formik.errors.accountNumber)
                }
                errorMessage={
                    formik.touched.accountNumber && formik.errors.accountNumber
                }
            />
            <Spacer y={4} />
            <Input
                id="name"
                label="Name"
                placeholder="Input name here"
                labelPlacement="outside"
                value={formik.values.name.toString()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={formik.touched.name && formik.errors.name}
            />
            <Spacer y={4} />
            <Input
                id="imageUrl"
                label="Image URL"
                placeholder="Input image URL here"
                labelPlacement="outside"
                value={formik.values.imageUrl.toString()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.imageUrl && formik.errors.imageUrl)}
                errorMessage={formik.touched.imageUrl && formik.errors.imageUrl}
            />
            {(!formik.errors.imageUrl) && formik.values.imageUrl && (
                <>
                    <Spacer y={4} />
                    <div>
                        <div className="text-sm">Preview</div>
                        <Spacer y={1.5} />
                        <Image
                            removeWrapper
                            radius="full"
                            className="w-20 h-20"
                            src={formik.values.imageUrl }
                            alt="Image URL"
                        />
                    </div>
                </>
            )}
            <Spacer y={6} />
            <div className="flex flex-row-reverse">
                <div className="flex gap-2">
                    <Button color="primary" variant="bordered" onPress={onClose}>
            Close
                    </Button>
                    <Button
                        isDisabled={(!formik.isValid) || !formik.values.name}
                        color="primary"
                        onPress={() => {
                            formik.handleSubmit()
                            onClose()
                        }}
                    >
            Create
                    </Button>
                </div>
            </div>
        </div>
    )
}
