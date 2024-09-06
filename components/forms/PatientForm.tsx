'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import CustomFormField from '../CustomFormField'
import { Form } from '../ui/form'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { UserFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'

export enum FormFieldType {
	INPUT = 'input',
	TEXTAREA = 'textarea',
	PHONE_INPUT = 'phoneInput',
	CHECKBOX = 'checkBox',
	DATE_PICKER = 'datePicker',
	SELECT = 'select',
	SKELETON = 'skeleton',
}

const PatientForm = () => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof UserFormValidation>>({
		resolver: zodResolver(UserFormValidation),
		defaultValues: {
			name: '',
			email: '',
			phone: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit({
		name,
		email,
		phone,
	}: z.infer<typeof UserFormValidation>) {
		setIsLoading(true)

		try {
			const userData = { name, email, phone }
			const user = await createUser(userData)
			if (user) router.push(`/patients/${user.$id}/register`)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 flex-1'>
				<section className='mb-12 space-y-4'>
					<h1 className='header'>Hi there 👋</h1>
					<p className='text-dark-700'>Schedule your first appointment.</p>
				</section>
				{/* name */}
				<CustomFormField
					feildType={FormFieldType.INPUT}
					control={form.control}
					name='name'
					label='Full Name'
					placeholder='Ahmed Mohamed'
					iconSrc='/assets/icons/user.svg'
					iconAlt='user'
				/>
				{/* Email */}
				<CustomFormField
					feildType={FormFieldType.INPUT}
					control={form.control}
					name='email'
					label='Email'
					placeholder='healthcare@healthcare.com'
					iconSrc='/assets/icons/email.svg'
					iconAlt='user'
				/>

				<CustomFormField
					feildType={FormFieldType.PHONE_INPUT}
					control={form.control}
					name='phone'
					label='Phone number'
					placeholder='065 9983463'
				/>
				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	)
}

export default PatientForm
