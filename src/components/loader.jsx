

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-accent border-secondary" />
    </div>
  );
}
/*export default function Loader(){
    return(
        <div className="w-full h-full flex justify-center items-center ">
            <div className="w-[100px] h-[100px] border-white  border-[6px] border-t-accent rounded-full animate-spin">

            </div>
        </div>
    )
}*/