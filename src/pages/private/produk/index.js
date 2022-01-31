import React from 'react';
import { Switch, Route } from 'react-router-dom';
import EditProduct from './edit';
import GridProduct from './grid';

function Produk() {
    return (
        <Switch>
            <Route path='/produk/edit/:produkId' component={EditProduct} />
            <Route component={GridProduct} />
        </Switch>
    );
}

export default Produk;