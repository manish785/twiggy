
import React from 'react';

class UserClass extends React.Component{

    constructor(props) {
        super(props);

        // console.log('hi' + props);
        
        this.state = {
            userInfo:{
                name: 'Dummy',
                location: 'Default',
            }
        }
        // console.log('Child Constructor');
    }
   
    async componentDidMount(){
        // console.log('Child Component Did Mount');
        // API CALL - 

        const data = await fetch('https://api.github.com/users/manish785');
        const json = await data.json();

        this.setState({
            userInfo: json
        })
        console.log(json);
    }

    componentDidUpdate() {
        console.log('Component Did Update');
    }
 
    componentWillUnmount() {
        console.log('Component will Unmount');
    }

    render() {
        const {name, location, avatar_url} = this.state.userInfo;
      
        // console.log('Child Render')

        return (
            <div className="user-card">
                <img src={avatar_url}/>
                <h2>Name: {name}</h2>
                <h3>Location: {location}</h3>
                <h4>Contact: manish123@gmail.com</h4>
            </div>
        )
    }
}

export default UserClass;