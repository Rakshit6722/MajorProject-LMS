import React from 'react'
import ContactDetails from '../components/ContactPage/ContactDetails'
import ContactForm from '../components/ContactPage/ContactForm'
import Footer from '../components/common/Footer'

function Contact() {
    return (
        <div>
            <div className='mx-auto mt-20 flex w-11/12 max-w-maxContent felx-col justify-between gap-10 text-white lg:flex-row flex-col'>
                <div className='lg:w-[40%]'>
                    <ContactDetails />
                </div>
                <div className='lg:w-[60%]'>
                    <ContactForm />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Contact