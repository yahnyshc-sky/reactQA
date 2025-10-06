import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    return (
        <footer
            className="py-4 mt-3 px-3 fixed-bottom"
            style={{
                backgroundColor: '#14EAB8'

            }}
        >
        <p className="container align-center">
            &copy; QA Ltd 2019
        </p>
        </footer>
    );
}

export default Footer;
