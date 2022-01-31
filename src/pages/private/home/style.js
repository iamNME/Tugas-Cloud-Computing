import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    productList: {
        backgroundColor: theme.palette.background.paper,
        maxHeight: 500,
        overflow: 'auto'
    },
    inputJumlah: {
        width: 40
    },
    saveIcon: {
        marginRight: theme.spacing(1)
    }
}));

export default useStyles;