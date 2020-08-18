import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import '../css/Style.css';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { loggedIn: false, email: '', password: '', err: [] };

        this.handleChange = this.handleChange.bind(this);
        this.handleSumbit = this.handleSumbit.bind(this);
        this.loginGoogle = this.loginGoogle.bind(this);
        this.loginFacebook = this.loginFacebook.bind(this);
    }

    componentDidMount() {
        if (typeof this.props.location.state != "undefined") {
            this.setState({
                email: this.props.location.state.email,
                password: this.props.location.state.password
            });
        }
    }

    loginGoogle(event) {
        event.preventDefault();
        window.open('http://localhost:5000/api/auth/google');
    }

    loginFacebook(event) {
        event.preventDefault();
        window.open('http://localhost:5000/api/auth/facebook');
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    handleSumbit(event) {
        event.preventDefault();
        axios.post('/api/auth/login', {
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                if (res.data.user) {
                    this.setState({
                        loggedIn: true,
                        user: res.data
                    });

                    this.props.history.push('/');
                }
            })
            .catch(err => {
                this.setState({
                    err: 'Invalid email or password.'
                });
            })
    }

    render() {
        let error;

        if (this.state.err.length !== 0) {
            error = <p style={{ color: "red" }}>{this.state.err}</p>;
        }

        return (
            <Container className="container">
                <Form onSubmit={this.handleSumbit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" required />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" required />
                    </Form.Group>

                    {error}

                    <Form.Group>
                    </Form.Group>

                    <Form.Group>
                        <Button type="submit">Log in</Button>
                        <Form.Label className="login-choice"> or using </Form.Label>
                        <Button className="login-button" onClick={this.loginGoogle}>Google</Button>
                        <Button className="login-button" onClick={this.loginFacebook}>Facebook</Button></Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Haven't had an account? <Link to='/register'>Register</Link>
                        </Form.Label>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}