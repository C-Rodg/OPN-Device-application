import React, { Component } from 'react';
import { View } from "react-desktop/windows";

class PasswordInput extends Component {
    state = {
        value: ''
    };

    componentDidMount() {
        console.log('component password input mounted');
    }

    onPasswordUpdate = (ev) => {
        this.setState({value: ev.target.value })
    }

    render() {
        return (
            <View padding="20px">
                <div>Password</div>
                <div>
                    <input type="password" onChange={this.onPasswordUpdate} value={this.state.value} />
                </div>
            </View>
        );
    }
}

export default PasswordInput;