import Header from "../components/Header";
import Intro from "../components/Intro";
import Wrapper from "../components/Wrapper";
import Main from "../components/main";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <>
      <Intro />
      <Wrapper>
        <Main />
      </Wrapper>
      <Banner />
    </>
  );
}
