'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import CustomFormField from '../CustomFormField'
import { Form, FormControl } from '../ui/form'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { PatientFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser, registerPatient } from '@/lib/actions/patient.actions'
import { FormFieldType } from './PatientForm'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import {
	Doctors,
	GenderOptions,
	IdentificationTypes,
	PatientFormDefaultValues,
} from '@/constants'
import { Label } from '../ui/label'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import FileUploader from '../FileUploader'

const RegisterForm = ({ user }: { user: User }) => {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormDefaultValues,
			name: '',
			email: '',
			phone: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
		setIsLoading(true)
		let formData

		if (
			values.identificationDocument &&
			values.identificationDocument.length > 0
		) {
			const blobFile = new Blob([values.identificationDocument[0]], {
				type: values.identificationDocument[0].type,
			})
			formData = new FormData()
			formData.append('blobFile', blobFile)
			formData.append('fileName', values.identificationDocument[0].name)
		}
		try {
			const patientData = {
				...values,
				userId: user.$id,
				birthDate: new Date(values.birthDate),
				identificationDocument: formData,
			}
			const patient = await registerPatient(patientData)

			if (patient) {
				router.push(`/patients/${user.$id}/new-appointment`)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-12 flex-1'>
				<section className='mb-4 space-y-4'>
					<h1 className='header'>Welcome 👋</h1>
					<p className='text-dark-700'>Let's know more about yourself.</p>
				</section>
				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Personal Information.</h2>
					</div>
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
				<div className='flex flex-col gap-6 xl:flex-row '>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.INPUT}
							control={form.control}
							name='email'
							label='Email'
							placeholder='healthcare@healthcare.com'
							iconSrc='/assets/icons/email.svg'
							iconAlt='user'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name='phone'
							label='Phone number'
							placeholder='065 9983463'
						/>
					</div>
				</div>
				<div className='flex flex-col gap-6 xl:flex-row'>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.DATE_PICKER}
							control={form.control}
							name='birthDate'
							label='Date of Birth'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.SKELETON}
							control={form.control}
							name='gender'
							label='Gender'
							renderSkeleton={(field) => (
								<FormControl>
									<RadioGroup
										className='flex h-11 gap-6 xl:justify-between'
										onValueChange={field.onChange}
										defaultValue={field.value}>
										{GenderOptions.map((option) => (
											<div className='radio-group' key={option}>
												<RadioGroupItem value={option} id={option} />
												<Label htmlFor={option} className='cursor-pointer'>
													{option}
												</Label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
							)}
						/>
					</div>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.INPUT}
							control={form.control}
							name='address'
							label='Address'
							placeholder='14th Street, Cairo'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.INPUT}
							control={form.control}
							name='occupation'
							label='Occupation'
							placeholder='Fullstack Developer'
						/>
					</div>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.INPUT}
							control={form.control}
							name='emergencyContactName'
							label='Emergency Contact Name'
							placeholder='Ahmed Abdelfattah'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name='emergencyContactNumber'
							label='Emergency Contact Number'
							placeholder='065 9983463'
						/>
					</div>
				</div>
				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Medical Information.</h2>
					</div>
				</section>
				<CustomFormField
					feildType={FormFieldType.SELECT}
					control={form.control}
					name='primaryPhysician'
					label='Primary Physician'
					placeholder='Select a Physician'>
					{Doctors.map((doctor) => (
						<SelectItem key={doctor.name} value={doctor.name}>
							<div className='flex cursor-pointer items-center gap-2'>
								<Image
									src={doctor.image}
									width={32}
									height={32}
									alt={doctor.name}
									className='rounded-full border border-dark-500'
								/>
								<p className=''>{doctor.name}</p>
							</div>
						</SelectItem>
					))}
				</CustomFormField>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.INPUT}
							control={form.control}
							name='insuranceProvider'
							label='Insurance Provider'
							placeholder='BlueCross BlueShield'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.INPUT}
							control={form.control}
							name='insurandePolicyNumber'
							label='Insurande Policy Number'
							placeholder='ABD123456789'
						/>
					</div>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.TEXTAREA}
							control={form.control}
							name='allergies'
							label='Allergies (if any)'
							placeholder='Peanuts, Penicillin, Pollen'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.TEXTAREA}
							control={form.control}
							name='currentMedication'
							label='Current Medication (if any)'
							placeholder='Ibuprofen 200mg, Paracetamol 500mg'
						/>
					</div>
				</div>

				<div className='flex flex-col gap-6 xl:flex-row'>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.TEXTAREA}
							control={form.control}
							name='familyMedicalHistory '
							label='Family medical history (if relevant)'
							placeholder='ex: Mother had breast cancer'
						/>
					</div>
					<div className='w-full lg:w-1/2'>
						<CustomFormField
							feildType={FormFieldType.TEXTAREA}
							control={form.control}
							name='pastMedicalHistory'
							label='Past medical history'
							placeholder='ex: Asthma diagnosis in childhood'
						/>
					</div>
				</div>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Identification and Verfication</h2>
					</div>
				</section>

				<CustomFormField
					feildType={FormFieldType.SELECT}
					control={form.control}
					name='IdentificationType'
					label='Identification type'
					placeholder='Select Identification type'>
					{IdentificationTypes.map((type) => (
						<SelectItem key={type} value={type}>
							{type}
						</SelectItem>
					))}
				</CustomFormField>

				<CustomFormField
					feildType={FormFieldType.INPUT}
					control={form.control}
					name='identificationNumber'
					label='Identification Number'
					placeholder='123456789'
				/>

				<CustomFormField
					feildType={FormFieldType.SKELETON}
					control={form.control}
					name='identificationDocument'
					label='scanned copy of identification document'
					renderSkeleton={(field) => (
						<FormControl>
							<FileUploader files={field.value} onChange={field.onChange} />
						</FormControl>
					)}
				/>

				<section className='space-y-6'>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header'>Consent and Privacy</h2>
					</div>
				</section>

				<CustomFormField
					feildType={FormFieldType.CHECKBOX}
					control={form.control}
					name='treatmentConsent'
					label='I consent to receive treatment for my health condition.'
				/>
				<CustomFormField
					feildType={FormFieldType.CHECKBOX}
					control={form.control}
					name='treatmentConsent'
					label='I consent to the use and disclosure of my health information for treatment purposes.'
				/>
				<CustomFormField
					feildType={FormFieldType.CHECKBOX}
					control={form.control}
					name='privacyConsent'
					label='I acknowledge that I have reviewed and agree to the privacy policy'
				/>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	)
}

export default RegisterForm
