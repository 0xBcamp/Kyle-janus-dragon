// Assuming this is a standard page component (e.g., pages/home.tsx)
import type { NextPage } from 'next';
import Home_Page from './components/Home_page';
import Navbar from './components/Navbar';
import SignupPage from './components/Signup_Page';

const Home: NextPage = () => {
  // Your page content here
  return (
    <div>
      <Navbar/>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <SignupPage/>
      </div>
      <Home_Page/>
    </div>
  );
};

export default Home;
