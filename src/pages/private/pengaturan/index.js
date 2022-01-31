import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Pengguna from './pengguna';
import Toko from './toko';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import useStyle from './style';


function Pengaturan(props) {
    const classes = useStyle();
    const { location, history } = props;
    const handleChangeTab = (event, value) => {
        history.push(value);
    }
    return (
        <Paper square>
            <Tabs value={location.pathname} indicatorColor="primary" textColor="primary" onChange={handleChangeTab}>
                <Tab label="Users" value='/pengaturan/pengguna' />
                <Tab label="Store" value='/pengaturan/toko' />
            </Tabs>
            <div className={classes.contentTab}>
                <Switch>
                    <Route path='/pengaturan/pengguna' component={Pengguna} />
                    <Route path='/pengaturan/toko' component={Toko} />
                    <Redirect to="/pengaturan/pengguna" />
                </Switch>
            </div>
        </Paper>
    );
}

export default Pengaturan;

