import Header from "@/components/Header";
import Editor from "@/components/editor/Editor";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        <Editor />
      </main>
    </div>
  );
};

export default Page;
