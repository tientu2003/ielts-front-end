'use client'
import {AbsoluteCenter, Box, Button, Text, Heading, Input, Stack, VStack} from "@chakra-ui/react"
import {Field} from "@/components/ui/field"
import {useForm} from "react-hook-form"
import TopNav from "@/components/my-ui/top-nav";
import '@fontsource/dancing-script'; // Import the Dancing Script font
import '@fontsource/lexend';
import { PasswordInput } from "@/components/ui/password-input"
import Link from "next/link";

interface FormValues {
    userName: string
    password: string
    confirmPassword: string
}


const RegisterPage = () => {

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm<FormValues>();


    const onSubmit = handleSubmit((data) => console.log(data))

    const password = watch("password", "");

    return <Box>
        <TopNav/>
        <form onSubmit={onSubmit}>
            <AbsoluteCenter>
                <Stack gap="4" minWidth={"sm"} maxW="sm">
                    <Heading color={'teal.500'} size={'4xl'} >
                        Sign in to your account
                    </Heading>
                    <Field
                        label="User Name"
                        invalid={!!errors.userName}
                        errorText={errors.userName?.message}
                    >
                        <Input
                            {...register("userName", {required: "User name is required"})}
                        />
                    </Field>
                    <Field
                        label="Password"
                        invalid={!!errors.password}
                        errorText={errors.password?.message}
                    >
                        <PasswordInput
                            {...register("password", { required: "Password is required" })}
                        />
                    </Field>

                    <Field
                        label="Confirm Password"
                        invalid={!!errors.confirmPassword}
                        errorText={errors.confirmPassword?.message}
                    >
                        <PasswordInput
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) => value === password || "Passwords do not match",
                            })}
                        />
                    </Field>


                    <VStack>
                        <Button variant={'surface'} minWidth={"sm"} colorPalette={'blue'} type="submit">
                            Sign Up
                        </Button>
                        <Text>Or</Text>
                        <Link href='/auth/login'>
                            <Button variant={'surface'} minWidth={"sm"} colorPalette={'teal'} >Sign In</Button>
                        </Link>
                    </VStack>
                </Stack>
            </AbsoluteCenter>
        </form>
    </Box>


}

export default RegisterPage;