import Image from 'next/image'
import Link from 'next/link'

import PatientForm from '@/components/forms/PatientForm'

export default function HomePage() {
	return (
		<main className='flex h-screen max-h-screen '>
			{/* OTP Verrification | PasskeyModal */}

			<section className='remove-scrollbar container my-auto'>
				<div className='sub-container max-w-[496px]'>
					<Image
						src='/assets/icons/logo-full.svg'
						alt='patient'
						width={1000}
						height={1000}
						className='mb-12 h-10 w-fit'
					/>
					<PatientForm />
					<div className='text-14-regular mt-20 justify-between '>
						<p className='justify-items-end text-dark-600 xl:text-left'>
							© 2024 Health Care
						</p>
						<Link href='/?admin=true' className='text-green-500'>
							Admin
						</Link>
					</div>
				</div>
			</section>
			<Image
				src='/assets/images/onboarding-img.png'
				alt='hero'
				width={1000}
				height={1000}
				className='side-img max-w-[50%]'
			/>
		</main>
	)
}
