import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles(theme => ({
    title: {
        marginTop: theme.spacing(6),
        textAlign: 'center'
    },
    paper: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(3)
    },
    buttons: {
        marginTop: theme.spacing(6)
    }
}));

export default useStyle;