import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography } from '@material-ui/core';
import useStyle from './style';

function NotFound() {
    const classes = useStyle();
    return <Container maxWidth="xs">
        <Paper className={classes.paper}>
            <Typography>Halaman Tidak Ditemukan</Typography>
            <Typography variant="h3">404</Typography>
            <Typography component={Link} to='/'>Back to home</Typography>
        </Paper>

    </Container>
}

export default NotFound;