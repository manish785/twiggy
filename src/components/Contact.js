import Footer from './Footer';

const Contact = () => {

  return (
    <>
     <div className='h-[600px] w-full bg-black'>
         <div className='flex'>
           <div className='left-container h-[600px] w-[400px] bg-black ml-[200px]'>
             <h1 className='font-bold text-white text-6xl pt-[100px] pl-[50px] font-thin'>Contact Us</h1>
             <p className='text-white font-thin ml-[55px] mt-[30px]'>
               Fill up the form and our team will get back to you within 24 hours
              </p>
              <form>
                <input
                 type='text'
                 className='border border-black h-[50px] w-[340px] ml-[55px]  mt-[30px] p-2 m-2 rounded-md'
                 placeholder='name'
                />
                 <input
                 type='text'
                 className='border border-black h-[50px] w-[340px] ml-[55px]  mt-[30px] p-2 m-2 rounded-md'
                 placeholder='message'
                />
                <button className='border border-black h-[50px] w-[340px] ml-[55px]  mt-[30px] p-2 m-2 bg-gray-100 rounded-md'> 
                  Submit
                </button>
              </form>
           </div>
           <div className='right-container h-[600px] w-[400px] bg-black ml-[200px]'>
              <h1 className='font-bold text-white text-6xl pt-[100px] pl-[50px] font-thin'>Our Contacts</h1>
              <p className='font-bold text-white ml-[50px] mt-[16px]'>manish123@gmail.com</p>
              <p className='font-bold text-white ml-[50px] mt-[3px]'>8910611562</p>

              <p className='font-bold text-2xl text-white ml-[50px] mt-[60px]'>Visit Us</p>
              <p className='text-white text-sm ml-[50px] mt-[2px]'>Kamtaul, Darbhanga</p>
           </div>
         </div>
    </div>
    <div>
      <Footer/>
    </div>
    </>
  );
};


export default Contact;