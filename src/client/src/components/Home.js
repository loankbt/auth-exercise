import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = { email: '' };

        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/auth/',
            {
                headers: { 'x-access-token': JSON.parse(localStorage.getItem('jwt')) }
            })
            .then(res => {
                if (res.data) {
                    this.setState({
                        loggedIn: true,
                        email: res.data.id
                    })
                } else {
                    console.log('Error!')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    logOut() {
        this.setState({
            loggedIn: false
        })

        localStorage.removeItem('jwt');
        this.props.history.push('/login');
    }

    render() {
        let item;

        if (!localStorage.getItem('jwt')) {
            item = <Redirect to='/login' />
        } else {
            item =
                <div>
                    <p>Hello, {this.state.email}</p>
                    <button type="submit" onClick={this.logOut}>Log out</button>
                </div>
        }

        return (
            <div>
                {item}
            </div>
        )
    }
}