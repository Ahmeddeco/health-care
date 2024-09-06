'use client'

import React from 'react'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Control } from 'react-hook-form'
import { FormFieldType } from './forms/PatientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface CustomProps {
	control: Control<any>
	feildType: FormFieldType
	name: string
	label?: string
	placeholder?: string
	iconSrc?: string
	iconAlt?: string
	disabled?: boolean
	dateFormat?: string
	showTimeSelect?: boolean
	children?: React.ReactNode
	renderSkeleton?: (field: any) => React.ReactNode
}

// RenderField component
const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
	const {
		feildType,
		iconSrc,
		iconAlt,
		placeholder,
		showTimeSelect,
		dateFormat,
		renderSkeleton,
	} = props
	/* --------------------------------- switch --------------------------------- */
	switch (feildType) {
		case FormFieldType.INPUT:
			return (
				<div className='flex rounded-md border border-dark-500 bg-dark-400 '>
					{iconSrc && (
						<Image
							src={iconSrc}
							alt={iconAlt || 'icon'}
							width={24}
							height={24}
							className='mx-4'
						/>
					)}
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							className='shad-input border-0'
						/>
					</FormControl>
				</div>
			)
		case FormFieldType.PHONE_INPUT:
			return (
				<FormControl>
					<PhoneInput
						defaultCountry='EG'
						placeholder={placeholder}
						international
						withCountryCallingCode
						value={field.value}
						onChange={field.onChange}
						className='input-phone'
					/>
				</FormControl>
			)
		case FormFieldType.DATE_PICKER:
			return (
				<div className='flex rounded-md border border-dark-500 bg-dark-400'>
					<Image
						src='/assets/icons/calendar.svg'
						height={24}
						width={24}
						alt='calendar'
					/>
					<FormControl>
						<DatePicker
							selected={field.value}
							onChange={(date) => field.onChange(date)}
							dateFormat={dateFormat ?? 'dd/MM/yyyy'}
							showTimeSelect={showTimeSelect ?? false}
							timeInputLabel='Time:'
							wrapperClassName='date-picker'
						/>
					</FormControl>
				</div>
			)
		case FormFieldType.SKELETON:
			return renderSkeleton ? renderSkeleton(field) : null
		default:
			break
	}
}

const CustomFormField = (props: CustomProps) => {
	const { control, feildType, name, label } = props
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{feildType !== FormFieldType.CHECKBOX && label && (
						<FormLabel>{label}</FormLabel>
					)}
					<RenderField field={field} props={props} />
					<FormMessage className='shad-error' />
				</FormItem>
			)}
		/>
	)
}

export default CustomFormField
