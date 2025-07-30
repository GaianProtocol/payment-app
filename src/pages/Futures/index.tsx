import { Header } from "@/components";
import Footer from "@/components/Footer";
import ContentLayout from "@/layouts/ContentLayout";
import LayoutContainer from "@/layouts/LayoutContainer";
import PageLayout from "@/layouts/PageLayout";
import { useState } from "react";
import AvailableGame from "./AvailableGame";
import Prediction from "./Prediction";
import WidgetChart from "./WidgetChart";

export default function FuturesPage() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <PageLayout>
      <LayoutContainer>
        <Header />
        <ContentLayout>
          <div className="flex flex-col-reverse justify-center items-center lg:items-start lg:flex-row gap-10 lg:gap-12 w-full max-w-[1400px] px-2 md:px-4 mx-auto mt-6">
            <WidgetChart />
            {!open ? <Prediction /> : <AvailableGame />}
          </div>
        </ContentLayout>
        <Footer />
      </LayoutContainer>
    </PageLayout>
  );
}
