import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { email: '', password: '', confirmPassword: '', register: false, error: [] }

        this.handleChange = this.handleChange.bind(this);
        this.handleSumbit = this.handleSumbit.bind(this);
    }

    handleChange(event) {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({ [nam]: val });
    }

    handleSumbit(event) {
        event.preventDefault();

        axios.post('/api/auth/register', {
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                console.log(res.data.error);

                if (res.data.user) {
                    this.setState({
                        registed: true
                    })
                } else {
                    this.setState({
                        error: res.data.error
                    })
                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    render() {
        let error;

        if (this.state.error.length !== 0) {
            error = <p style={{ color: "red" }}>{this.state.error}</p>;
        }

        if (this.state.registed) {
            return <Redirect to={{
                pathname: '/login',
                state: { email: this.state.email, password: this.state.password }
            }} />
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
                        <Form.Control type="password" name="password" minLength="8" value={this.state.password} onChange={this.handleChange} placeholder="Password" required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control type="password" name="confirmPassword" minLength="8" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Type password again" required />
                    </Form.Group>

                    {error}

                    <Form.Group><Button type="submit">Register</Button></Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Have had an account? <Link to='/login'>Log in</Link>
                        </Form.Label>
                    </Form.Group>
                </Form>
            </Container>
        )
    }
}