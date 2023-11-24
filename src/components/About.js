
import User from "./User";
import UserClass from "./UserClass";
import React from 'react';

class About extends React.Component {
    constructor(props){
        super(props);

        // console.log('Parent Constructor');
    }
    
    componentDidMount(){
        // console.log('Parent Component Did Mount');
    }
 

    render() {
        // console.log('Parent Constructor');
        return (
            <div>
                <h1>About</h1>
                <h2>This is Namaste React Web Series</h2>
                {/* <User name={'Manish Kumar (function)'}/> */}
                <UserClass name={'first'} location={'Darbhanga Class'}/>
            </div>
        )
    }
}



export default About;