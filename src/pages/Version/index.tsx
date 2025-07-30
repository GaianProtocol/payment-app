import PageLayout from "@/layouts/PageLayout";

export const Version = () => {
  return (
    <PageLayout>
      <div>{import.meta.env.VITE_BASE_API}</div>
      <div>version: v0.0.6</div>
    </PageLayout>
  );
};
