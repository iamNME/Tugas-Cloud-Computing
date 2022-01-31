import React, { useState, useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyle from './style/grid';
import AddDialog from './add';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import { currency } from '../../../utils/formatter';
import { Link } from 'react-router-dom';

function GridProduct() {
    const classes = useStyle();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const { firestore, storage, user } = useFirebase();
    const productCol = firestore.collection(`toko/${user.uid}/produk`);
    const [snapshot, loading] = useCollection(productCol);
    const [productItems, setProductItems] = useState([]);

    useEffect(() => {
        if (snapshot) {
            setProductItems(snapshot.docs);
        }
    }, [snapshot]);

    const handleDelete = productDoc => async e => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await productDoc.ref.delete();
            const photoURL = productDoc.data().photo;
            if (photoURL) {
                await storage.refFromURL(photoURL).delete();
            }
        }
    }
    if (loading) {
        return <AppPageLoading />
    }

    return <>
        <Typography variant="h5" component="h1" paragraph>List Product</Typography>
        {productItems.length <= 0 &&
            <Typography>You do not have a product</Typography>}
        <Grid container spacing={5}>
            {
                productItems.map((productDoc) => {
                    const productData = productDoc.data();
                    return <Grid key={productDoc} item={true} xs={12} sm={12} md={6} lg={4}>
                        <Card className={classes.card}>
                            {
                                productData.photo &&
                                <CardMedia
                                    className={classes.photo}
                                    image={productData.photo}
                                    title={productData.nama}
                                />
                            }
                            {
                                !productData.photo &&
                                <div className={classes.photoPlaceHolder}>
                                    <ImageIcon size="large" color="disabled" />
                                </div>
                            }
                            <CardContent className={classes.productDetails}>
                                <Typography variant="h5" noWrap>{productData.nama}</Typography>
                                <Typography variant="subtitle1" noWrap>Price: {currency(productData.harga)}</Typography>
                                <Typography variant="subtitle1" noWrap>Stock: {productData.stock}</Typography>
                            </CardContent>
                            <CardActions className={classes.productActions}>
                                <IconButton component={Link} to={`/produk/edit/${productDoc.id}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={handleDelete(productDoc)}>
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                })
            }
        </Grid>
        <Fab color="primary" className={classes.fab}
            onClick={e => {
                setOpenAddDialog(true);
            }}
        >
            <AddIcon />
        </Fab>
        <AddDialog open={openAddDialog} handleClose={() => {
            setOpenAddDialog(false);
        }} />
    </>
}

export default GridProduct;