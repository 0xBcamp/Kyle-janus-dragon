// Assuming this is a standard page component (e.g., pages/home.tsx)
import type { NextPage } from 'next';
import Home_Page from '../components/Home_page';
import Navbar from '../components/Navbar';
import MoonPage from '@/components/Moon_Page';

const Home: NextPage = () => {
  // Your page content here
  return (
    <div>
      <Navbar/>
      <MoonPage/>
      <Home_Page/>
    </div>
  );
};

export default Home;
