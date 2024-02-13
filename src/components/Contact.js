import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Footer from './Footer';

const Contact = () => {

  return (
    <>
    <div className='w-full h-[290px]'>
      <h1 className='font-bold text-3xl p-4 m-[-2px]'>Contact Us Page</h1>
      <form>
        <input
          type='text'
          className = 'border border-black p-2 m-2'
          placeholder='name'
        />
         <input
          type='text'
          className = 'border border-black p-2 m-2'
          placeholder='message'
        />
        <button className='border border-black p-2 m-2 bg-gray-100 rounded-lg'>
         Submit
        </button>
      </form>
    </div>
    <div className='mt-[100px]'>
    <Footer/>
    </div>
    </>
  );
};


export default Contact;