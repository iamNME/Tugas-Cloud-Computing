import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import ImageIcon from '@material-ui/icons/Image';
import SaveIcon from '@material-ui/icons/Save';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';
import useStyles from './style';
import { useSnackbar } from 'notistack';
import { currency } from '../../../utils/formatter';
import format from 'date-fns/format';

function Home() {
    const classes = useStyles();
    const { firestore, user } = useFirebase();
    const todayDateString = format(new Date(), 'YYY-MM-dd');
    const productCol = firestore.collection(`toko/${user.uid}/produk`);
    const transaksiCol = firestore.collection(`toko/${user.uid}/transaksi`);
    const [snapshotTransaksi, loadingTransaksi] = useCollection(transaksiCol.where('tanggal', '==', todayDateString));
    const initialTransaction = {
        no: '',
        items: {

        },
        total: 0,
        tanggal: todayDateString
    };
    const [transaksi, setTransaksi] = useState(initialTransaction);
    const [snapshotProduct, loadingProduct] = useCollection(productCol);
    const [productItems, setProductItems] = useState([]);
    const [filterProduct, setFilterProduct] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (snapshotTransaksi) {
            setTransaksi(transaksi => ({
                ...transaksi,
                no: `${transaksi.tanggal}/${snapshotTransaksi.docs.length + 1}`
            }));
        } else {
            setTransaksi(transaksi => ({
                ...transaksi,
                no: `${transaksi.tanggal}/1`
            }));
        }
    }, [snapshotTransaksi]);

    useEffect(() => {
        if (snapshotProduct) {
            setProductItems(snapshotProduct.docs.filter((productDoc) => {
                if (filterProduct) {
                    return productDoc.data().nama.toLowerCase().includes(filterProduct.toLowerCase());
                }
                return true;
            }));
        }
    }, [snapshotProduct, filterProduct]);
    const addItem = productDoc => e => {
        let newItem = { ...transaksi.items[productDoc.id] };
        const productData = productDoc.data();

        if (newItem.jumlah) {
            newItem.jumlah = newItem.jumlah + 1;
            newItem.subtotal = productData.harga * newItem.jumlah;
        } else {
            newItem.jumlah = 1;
            newItem.harga = productData.harga;
            newItem.subtotal = productData.harga;
            newItem.nama = productData.nama;
        }
        const newItems = {
            ...transaksi.items,
            [productDoc.id]: newItem
        }
        if (newItem.jumlah > productData.stock) {
            enqueueSnackbar('Quantity exceeds product stock', { variant: 'error' });
        } else {
            setTransaksi({
                ...transaksi,
                items: newItems,
                total: Object.keys(newItems).reduce((total, k) => {
                    const item = newItems[k];
                    return total + parseInt(item.subtotal);
                }, 0)
            });
        }
    }
    const handleChangeJumlah = k => e => {
        let newItem = { ...transaksi.items[k] };
        newItem.jumlah = parseInt(e.target.value);
        newItem.subtotal = newItem.harga * newItem.jumlah;
        const newItems = {
            ...transaksi.items,
            [k]: newItem
        };
        const productDoc = productItems.find(item => item.id === k);
        const productData = productDoc.data()
        if (newItem.jumlah > productData.stock) {
            enqueueSnackbar('Quantity exceeds product stock', { variant: 'error' });
        } else {
            setTransaksi({
                ...transaksi,
                items: newItems,
                total: Object.keys(newItems).reduce((total, k) => {
                    const item = newItems[k];
                    return total + parseInt(item.subtotal);
                }, 0)
            })
        }
    }
    const saveTransaction = async (e) => {
        if (Object.keys(transaksi.items).length <= 0) {
            enqueueSnackbar('No transaction to save', { variant: 'error' });
            return false;
        }
        setSubmitting(true);
        try {
            await transaksiCol.add({
                ...transaksi,
                timestamp: Date.now()
            })

            //Update Stock product menggunakan transactions
            await firestore.runTransaction(transaction => {
                const productIDs = Object.keys(transaksi.items);
                return Promise.all(productIDs.map(produkId => {
                    const productRef = firestore.doc(`toko/${user.uid}/produk/${produkId}`);

                    return transaction.get(productRef).then((productDoc) => {
                        if (!productDoc.exists) {
                            throw Error('Product does not exists');
                        }
                        let newStock = parseInt(productDoc.data().stock) - parseInt(transaksi.items[produkId].jumlah);

                        if (newStock < 0) {
                            newStock = 0;
                        }
                        transaction.update(productRef, { stock: newStock });
                    })
                }));
            });

            enqueueSnackbar('Transaction successfully saved', { variant: 'success' });
            setTransaksi(transaksi => ({
                ...initialTransaction,
                no: transaksi.no
            }));

        } catch (e) {
            enqueueSnackbar(e.message, { variant: 'error' });
        }
        setSubmitting(false);
    }
    if (loadingProduct || loadingTransaksi) {
        return <AppPageLoading />
    }
    return <>
        <Typography variant="h5" component="h1" paragraph>Create New Transaction</Typography>
        <Grid container spacing={5}>
            <Grid item xs>
                <TextField
                    label="No. Transaction"
                    value={transaksi.no}
                    inputProps={{
                        readOnly: true
                    }}
                />
            </Grid>
            <Grid item>
                <Button disabled={isSubmitting} onClick={saveTransaction} color="primary" size="large" variant="contained"><SaveIcon className={classes.saveIcon} /> Save Transaction</Button>
            </Grid>
        </Grid>
        <Grid container spacing={5}>
            <Grid item xs={12} md={8}>
                <Table>
                    <TableHead>
                        <TableCell>Item</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>SubTotal</TableCell>             </TableHead>
                    <TableBody>
                        {
                            Object.keys(transaksi.items).map(k => {
                                const item = transaksi.items[k];
                                return (
                                    <TableRow key={k}>
                                        <TableCell>{item.nama}</TableCell>
                                        <TableCell><TextField
                                            className={classes.inputJumlah}
                                            value={item.jumlah}
                                            type="number"
                                            onChange={handleChangeJumlah(k)}
                                            disabled={isSubmitting}
                                        /></TableCell>
                                        <TableCell>{currency(item.harga)}</TableCell>
                                        <TableCell>{currency(item.subtotal)}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                        <TableRow>
                            <TableCell colSpan={3}><Typography variant="subtitle2">Total: </Typography></TableCell>
                            <TableCell><Typography variant="h6">{currency(transaksi.total)}</Typography></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
            <Grid item xs={12} md={4}>
                <List
                    className={classes.productList}
                    component="nav"
                    subheader={
                        <ListSubheader component="div">
                            <TextField
                                autoFocus
                                label="Search Product"
                                margin="normal"
                                fullWidth
                                onChange={e => {
                                    setFilterProduct(e.target.value);
                                }}
                                disabled={isSubmitting}
                            />
                        </ListSubheader>
                    }>
                    {
                        productItems.map((productDoc) => {
                            const productData = productDoc.data();
                            return <ListItem
                                key={productDoc.id}
                                button
                                disabled={!productData.stock}
                                onClick={addItem(productDoc)}
                            >
                                {
                                    productDoc.photo ?
                                        <ListItemAvatar>
                                            <Avatar
                                                src={productData.photo}
                                                alt={productData.nama}
                                            />
                                        </ListItemAvatar>
                                        :
                                        <ListItemIcon>
                                            <ImageIcon />
                                        </ListItemIcon>
                                }
                                <ListItemText
                                    primary={productData.nama}
                                    secondary={`Stock: ${productData.stock || 0}`}
                                />

                            </ListItem>
                        })
                    }
                </List>
            </Grid>
        </Grid>
    </>
}

export default Home;