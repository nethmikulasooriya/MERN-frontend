export default function LoginPage() {
  return (
    <div className="w-full h-screen bg-[url('/login.jpg')] bg-center bg-cover flex justify-evenly items-center">
      <div className="w-[50%] h-full ">
      </div>
      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[20px] shadow-xl">
          <input className="w-[300px] h-[50px]" />
        </div>
      </div>
    </div>
  );
}
