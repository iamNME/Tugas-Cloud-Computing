import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import useStyle from './style';
import { Link, Redirect } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import { useFirebase } from '../../components/FirebaseProvider';
import AppLoading from '../../components/AppLoading';
import { useSnackbar } from 'notistack'

function LupaPassword() {
    const classes = useStyle();
    const [isSubmiting, setSubmiting] = useState(false);
    const [form, setForm] = useState({
        email: ''
    });
    const [error, setError] = useState({
        email: ''
    });
    const { auth, user, loading } = useFirebase();
    const { enqueueSnackbar } = useSnackbar();
    const handleChange = e => {
        setForm({
            ...form, [e.target.name]: e.target.value
        });
        setError({
            ...error, [e.target.name]: ''
        });
    }

    const validate = () => {
        const newErrors = { ...error };

        if (!form.email) {
            newErrors.email = 'Email is empty';
        } else if (!isEmail(form.email)) {
            newErrors.email = 'Email no valid'
        }

        return newErrors;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();
        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmiting(true);
                const actionCodeSettings = {
                    url: `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings);
                enqueueSnackbar(`please check your email: ${form.email}, a link to reset your new password`, {
                    variant: 'success'
                });
                isSubmiting(false);
            } catch (e) {
                const newErrors = {};
                switch (e.code) {
                    case 'auth/user-not-found':
                        newErrors.email = 'Email no registed';
                        break;
                    case 'auth/invalid-email':
                        newErrors.email = 'Email no valid';
                        break;
                    default:
                        newErrors.email = 'An error occurred, please try again';
                        break;
                }
                setError(newErrors);
                setSubmiting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        return <Redirect to='/' />
    }


    return <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography className={classes.title} variant="h5" component="h2">
                Forgot Password
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    id="email"
                    name="email"
                    type="email"
                    margin="normal"
                    label="Email Address"
                    fullWidth
                    required
                    onChange={handleChange}
                    helperText={error.email}
                    error={error.email ? true : false}
                    disabled={isSubmiting}

                />
                <Grid container>
                    <Grid item xs>
                        <Button disabled={isSubmiting} className={classes.buttons} type="submit" size="large" variant="contained" color="primary">Send</Button>
                    </Grid>
                    <Grid item>
                        <Button disabled={isSubmiting} className={classes.buttons} component={Link} variant="contained" size="large" to='/login'>Login</Button>
                    </Grid>
                </Grid>
            </form>

        </Paper>
    </Container>
}

export default LupaPassword;