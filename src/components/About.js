// import UserClass from "./UserClass";
import React from 'react';
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

const About = () => {
    const [userInfo, setUserInfo] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUserProfileInfo();
    }, []);

    const getUserProfileInfo = async () => {
       const data = await fetch('https://api.github.com/users/manish785');
       const json = await data.json();
       setUserInfo(json);
       setLoading(false);
    }

    if(userInfo.length === 0){
        return <h1>Data is loading</h1>
    }

    return(
        <>
           <div className="h-[700px] w-full bg-blue-200 flex ">
            <div className="h-[700px] w-[1000px] bg-white ml-[70px] flex flex-wrap">
                <div>
                    <img 
                     className="p-[6px] h-[300px] w-[300px]"
                     src={userInfo.avatar_url} 
                     alt='profile-pic'
                    />
                    <h1 className="font-thin text-3xl p-[4px] pt-[10px]">Name: {userInfo.name}</h1>
                    <p className="font-normal text-3xl p-[4px] pt-[10px]">Location: {userInfo.location}</p>
                    <p className="font-normal text-3xl p-[4px] pt-[10px]">Software Developer</p>
              
                    <div className=''>
                    <div>
                        <h1 className='font-bold text-xl p-[4px]'>My Coding Profile</h1>
                    </div>
                        <span className='ml-4'>
                            <div className="mt-[-30px]">
                                <Link to='https://leetcode.com/9073078357manish/' className='flex items-center'>
                                <span className="p-[4px]">Leetcode Profile :</span>
                                <img className='h-[30px] w-[30px] ml-2' src='https://cdn.iconscout.com/icon/free/png-256/free-leetcode-3521542-2944960.png' alt='leetcode-icon' />
                                </Link>
                            </div>
                            <div className="mt-[-20px]">
                                <Link to='https://github.com/manish785' className='flex items-center pt-4'>
                                <span className="p-[4px]">Github Profile :</span>
                                <img className='h-[30px] w-[30px] ml-2' src='https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png' alt='leetcode-icon' />
                                </Link>
                            </div>
                        </span>
                    </div>
                </div>

                <div>
                <div>
                    <h1 className="text-blue-900 font-bolder text-3xl p-[40px]">BIO</h1>
                    <p className="pl-[40px] pt-[-10px]">
                        Certainly! Here's a Lorem Ipsum text:Lorem ipsum dolor sit amet, <br></br>consectetur adipiscing elit. 
                        Sed nec libero convallis, convallis sem <br></br>sit amet, placerat turpis. Integer pretium justo ut nulla lacinia, 
                        <br></br>
                    </p>
                </div>

                <div>
                    <h1 className="text-blue-900 font-bolder text-3xl p-[40px]">GOALS</h1>
                    <p className="pl-[40px] pt-[-1000px]">
                        Certainly! Here's a Lorem Ipsum text:Lorem ipsum dolor sit amet, <br></br>consectetur adipiscing elit. 
                        Sed nec libero convallis, convallis sem <br></br>sit amet, placerat turpis. Integer pretium justo ut nulla lacinia, 
                        <br></br>
                    </p>
                </div>

                <div>
                    <h1 className="text-blue-900 font-bolder text-3xl p-[40px]">WANTS AND NEEDS</h1>
                    <p className="pl-[40px] pt-[-10px]">
                        Certainly! Here's a Lorem Ipsum text:Lorem ipsum dolor sit amet, <br></br>consectetur adipiscing elit. 
                        Sed nec libero convallis, convallis sem <br></br>sit amet, placerat turpis. Integer pretium justo ut nulla lacinia, 
                        <br></br>
                    </p>
                </div>
               </div>
            </div>
            
            <div className="h-[700px] w-[400px] bg-white ml-[70px] flex flex-wrap">
                <div>
                    <h1 className="text-blue-900 font-bolder text-3xl p-[40px]">TECH</h1>
                    <p className="pl-[40px] pt-[-10px]">Design Software</p>
                    <p className="pl-[40px] pt-[-10px]">Web Apps</p>
                    <p className="pl-[40px] pt-[-10px]">Socail Media</p>
                </div>

                <div>
                    <h1 className="text-blue-900 font-bolder text-3xl p-[40px]">BIO</h1>
                    <p className="pl-[40px] pt-[-10px]">
                        Certainly! Here's a Lorem Ipsum text:Lorem ipsum dolor sit amet, <br></br>consectetur adipiscing elit. 
                        Sed nec libero convallis, convallis sem <br></br>sit amet, placerat turpis. Integer pretium justo ut nulla lacinia, 
                        <br></br>
                    </p>
                </div>

            </div>
           </div>
           <Footer/>
        </>
        
    )
};






// class About extends React.Component {
//     constructor(props){
//         super(props);
//     }
    
//     componentDidMount(){
//     }
 
//     render() {
//         return (
//             <div className="pb-20">
//                 {/* <h1>About Me</h1>
//                 <UserClass name={'first'} location={'Darbhanga Class'}/>
//                 <Footer/> */}
//             </div>
//         )
//     }
// }


export default About;