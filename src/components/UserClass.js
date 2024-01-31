import React from 'react';
import { Link } from 'react-router-dom';

class UserClass extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            userInfo:{
                name: 'Dummy',
                location: 'Default',
            }
        }
    }
   
    async componentDidMount(){
        // API CALL - 
        const data = await fetch('https://api.github.com/users/manish785');
        const json = await data.json();

        this.setState({
            userInfo: json
        })
    }

    componentDidUpdate() {
        console.log('Component Did Update');
    }
 
    componentWillUnmount() {
        console.log('Component will Unmount');
    }

    render() {
        const {name, location, avatar_url} = this.state.userInfo;
      
        return (
            <div className="user-card">
                <img className='h-[240px] w-[240px]' src={avatar_url}/>
                <h2>Name: {name}</h2>
                <h3>Location: {location}</h3>
                <h4>Contact: manish123@gmail.com</h4>
                <div className=''>
                    <div>
                        <h1 className='font-bold text-xl'>My Coding Profile</h1>
                    </div>
                <span className='ml-4'>
                    <Link to='https://leetcode.com/9073078357manish/' className='flex items-center'>
                    <span>Leetcode Profile :</span>
                    <img className='h-[30px] w-[30px] ml-2' src='https://cdn.iconscout.com/icon/free/png-256/free-leetcode-3521542-2944960.png' alt='leetcode-icon' />
                    </Link>
                    <Link to='https://github.com/manish785' className='flex items-center pt-4'>
                    <span>Github Profile :</span>
                    <img className='h-[30px] w-[30px] ml-2' src='https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png' alt='leetcode-icon' />
                    </Link>
                </span>
                </div>
            </div>
        )
    }
}


export default UserClass;