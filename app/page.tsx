import Banner from './components/Banner/Banner';
import Companies from './components/Companies/Companies';
import Mentor from './components/Mentor/Mentor';
import Students from './components/Students/Students';
import Newsletter from './components/Newsletter/Newsletter';
import ProductsSection from './components/Products/ProductsSection';
//import DashboardCard from './components/DashboardCard/dashboardcard';
export default function Home() {
  return (
    <main>
      <Banner />
      <Companies />
      <ProductsSection />
      <Mentor />
      <Students />
      <Newsletter />
    </main>
  )
}
