//components
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <>
      <nav>
        <Navbar />
      </nav>

      <main>{children}</main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
