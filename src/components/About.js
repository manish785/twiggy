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
                <h1>About</h1>
                <h2>This is Namaste React Web Series</h2>
                <UserClass name={'first'} location={'Darbhanga Class'}/>
            </div>
        )
    }
}


export default About;