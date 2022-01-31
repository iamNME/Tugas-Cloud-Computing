import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import useStyle from './style';
import isEmail from 'validator/lib/isEmail';
import { useFirebase } from '../../components/FirebaseProvider';
import AppLoading from '../../components/AppLoading';


function Login(props) {
    const { location } = props;
    const classes = useStyle();
    const [isSubmiting, setSubmiting] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState({
        email: '',
        password: ''
    });
    const { auth, user, loading } = useFirebase();
    const handleChange = e => {
        setForm({
            ...form, [e.target.name]: e.target.value
        });
        setError({
            ...error, [e.target.name]: ''
        });
    }
    const validate = () => {
        const newError = { ...error };
        if (!form.email) {
            newError.email = 'Email is empty';
        } else if (!isEmail(form.email)) {
            newError.email = 'Email no valid';
        }

        if (!form.password) {
            newError.password = 'Password is empty';
        }

        return newError;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmiting(true);
                await auth.signInWithEmailAndPassword(form.email, form.password);
            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email not register';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email no valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Password is wrong';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'User is Blocked';
                        break;
                    default:
                        newError.email = 'n error occurred, please try again';
                        break;
                }
                setError(newError);
                setSubmiting(false);
            }
        }
    }
    if (loading) {
        return <AppLoading />
    }
    if (user) {
        const redirectTo = location.state && location.state.from && location.state.from.pathname ? location.state.from.pathname : '/';
        return <Redirect to={redirectTo} />
    }


    console.log(form);
    return <Container maxWidth="xs">
        <Typography className={classes.title1} variant="h5" component="h1">Web App</Typography>
        <Paper className={classes.paper}>
            <Typography className={classes.title2} variant="h5" component="h1">Login</Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    margin="normal"
                    fullWidth
                    required
                    onChange={handleChange}
                    helperText={error.email}
                    error={error.email ? true : false}
                    disabled={isSubmiting}
                />
                <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="password"
                    margin="normal"
                    fullWidth
                    required
                    onChange={handleChange}
                    helperText={error.password}
                    error={error.password ? true : false}
                    disabled={isSubmiting}
                />
                <Grid container >
                    <Grid item xs>
                        <Button disabled={isSubmiting} className={classes.buttons} type="submit" variant="contained" color="primary" size="large">Login</Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={isSubmiting} className={classes.buttons} component={Link} variant="contained" size="large" to="../register">Register</Button>
                    </Grid>
                </Grid>
                <div className={classes.forgotPassword}>
                    <Typography component={Link} to='/lupa-password'>
                        Forgot Password?
                    </Typography>
                </div>
            </form>
        </Paper>
    </Container>
}

export default Login