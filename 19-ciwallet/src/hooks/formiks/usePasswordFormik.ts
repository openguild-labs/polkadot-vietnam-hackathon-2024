import { FormikProps, useFormik } from "formik"
import * as Yup from "yup"
import { useFormiks } from "."
import { useDispatch } from "react-redux"
import { setPassword } from "@/redux"

export interface PasswordFormikValues {
    password: string;
}

export const _usePasswordFormik = (): FormikProps<PasswordFormikValues> => {

    const dispatch = useDispatch()

    const initialValues: PasswordFormikValues = {
        password: "",
    }

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async ({ password }) => {
            dispatch(setPassword(password))
        },
    })

    return formik
}

export const usePasswordFormik = () => {
    const { passwordFormik } = useFormiks()
    return passwordFormik
}