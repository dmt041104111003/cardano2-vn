import { Layout, Navbar } from "nextra-theme-docs";
import { Banner, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import { images } from "~/public/images";
import Image from "next/image";

const banner = <Banner  
storageKey="some-key">Welcome to Cardano2VN docs</Banner>;
const navbar = <Navbar logo={<Image className="text-xl h-10 w-auto  font-bold text-white" loading="lazy" src={images.logo} alt="Cardano2vn" />} />;

const search = <Search placeholder="Search docs.."></Search>;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      banner={banner}
      navbar={navbar}
      pageMap={await getPageMap()}
      search={search}
      editLink={null}
      feedback={{ content: null }}
    >
      {children}
    </Layout>
  );
}
