import React, { Component } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = { loggedIn: false, name: '' };
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        axios.get('/api/auth/')
            .then(res => {
                if (res.data) {
                    this.setState({
                        loggedIn: true,
                        name: res.data.email
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    logOut() {
        axios.get('/api/auth/logout')
            .then(res => {
                this.setState({
                    loggedIn: false
                });
            })
            .catch(err => {
                console.log(err);
            });
        this.props.history.push('/login');
    }

    render() {
        return (
            <Container className="container">
                {!this.state.loggedIn ?
                    (<div>
                        <p>You haven't logged in.</p>
                        <a href='/login'>
                            <button className="btn btn-primary" type="submit" onClick={this.logOut}>Log in</button>
                        </a>
                    </div>) :
                    (<div className="loggedIn">
                        <p>Hello, {this.state.name}</p>
                        <button className="btn btn-warning" type="submit" onClick={this.logOut}>Log out</button>
                    </div>)}
            </Container>
        )
    }
}