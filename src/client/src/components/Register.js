import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = { email: '', password: '', register: false }

        this.handleChange = this.handleChange.bind(this)
        this.handleSumbit = this.handleSumbit.bind(this)
    }

    handleChange(event) {
        let nam = event.target.name
        let val = event.target.value
        this.setState({ [nam]: val })
    }

    handleSumbit(event) {
        event.preventDefault()

        axios.post('http://localhost:5000/api/auth/register', {
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                if (res.data) {
                    this.setState({
                        registed: true
                    })
                } else {
                    console.log('Error!')
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        if (this.state.registed) {
            // return <Login email={this.state.email} password={this.state.password} />
            return <Redirect to={{
                                pathname: '/login',
                                state: { email: this.state.email, password: this.state.password }
            }} />
        }

        return (
            <Form onSubmit={this.handleSumbit}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>

                <Form.Group>
                    <Form.Label>
                        Have had an account? <Link to='/login'>Log in</Link>
                    </Form.Label>
                </Form.Group>
            </Form>
        )
    }
}