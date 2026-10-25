import "../css/main.css"

const Shark = "/images/shark.jpeg";

export default function Welcome() {
  return (
    <>
      <div className="wrapper">
        <h1>Welcome To My App</h1>
        <p>This may look a little cute. I would call a shark as a little husky! </p>
          <img src={Shark} alt="Shark Image" width={200} height={200} />
      </div>
    </>
  );
}
