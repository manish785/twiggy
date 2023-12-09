import UserClass from "./UserClass";
import React from 'react';

class About extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
    }
 
    render() {
        return (
            <div>
                <h1>About Me</h1>
                <UserClass name={'first'} location={'Darbhanga Class'}/>
            </div>
        )
    }
}


export default About;