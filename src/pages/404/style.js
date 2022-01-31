import { makeStyles } from '@material-ui/styles';

const useStyle = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(6),
        padding: theme.spacing(8),
        textAlign: 'center'
    }
}));

export default useStyle;