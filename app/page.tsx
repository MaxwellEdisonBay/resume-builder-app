const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Build your own resume really fast!
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center">
          Automated Resume Generation
        </span>
      </h1>
      <p className="desc text-center">
        Use this tool to build custom resumes with existing templates really
        fast. Enjoy exporting to PDF!
      </p>
    </section>
  );
};

export default Home;
