import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const contactDetails = {
  name: 'Manish Kumar',
  bio: 'Full Stack Developer',
  contact: {
    email: '9073078357manish@gmail.com',
    github: 'https://github.com/manish785',
    linkedin: 'https://www.linkedin.com/in/manish-kumar-982b4416b/',
  },
};

const Contact = () => {
  return (
    <div className='container-max min-h-screen'>
        <h1 className='text-2xl my-4 font-bold'>Contact Details</h1>
        <div>
            <h2 className='text-xl font-semibold'>Hi 👋, I'm {contactDetails.name} 👩‍💻</h2>
            <p className='text-lg'>{contactDetails.bio}</p>

            <div className='my-4 space-y-2'>
            <h3 className='text-lg font-semibold'>Connect with me</h3>
            <p className='flex flex-wrap items-center gap-2'>
                <span className='font-semibold'>Gmail: </span>
                <a href={contactDetails.contact.email} className='flex items-center gap-1'>
                {contactDetails.contact.email}
                <ArrowTopRightOnSquareIcon className='w-4 h-4' />
                </a>
            </p>
            <p className='flex flex-wrap items-center gap-2'>
                <span className='font-semibold'>Github: </span>{' '}
                <a
                href={contactDetails.contact.github}
                className='flex items-center gap-1'
                >
                {contactDetails.contact.github}
                <ArrowTopRightOnSquareIcon className='w-4 h-4' />
                </a>
            </p>
            <p className='flex flex-wrap items-center gap-2'>
                <span className='font-semibold'>Linkedin: </span>{' '}
                <a
                href={contactDetails.contact.linkedin}
                className='flex items-center gap-1'
                >
                {contactDetails.contact.linkedin}
                <ArrowTopRightOnSquareIcon className='w-4 h-4' />
                </a>
            </p>
            </div>
        </div>
    </div>
  );
};


export default Contact;