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
            <div className="pb-20">
                <h1>About Me</h1>
                <UserClass name={'first'} location={'Darbhanga Class'}/>
            </div>
        )
    }
}


export default About;