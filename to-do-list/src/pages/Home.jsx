import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Table from '../components/table/Table';

const Home = () => {
    return (
        <div className="Home" style={{ textAlign: 'center', alignSelf: 'center' }}>
            <Header />
            <Table />

            <Footer />
        </div>
    );
};

export default Home;
