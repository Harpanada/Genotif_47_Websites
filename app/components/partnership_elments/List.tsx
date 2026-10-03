export default function List({ txtContain }: any) {
  return (
    <div className="flex gap-0 w-full  items-center text-left">
      <li className="font-['body-medium']  text-[#74EEEE]  text-sm md:text-lg"></li>
      <h5 className="font-['body-medium']  font-bold text-sm w-full md:text-lg">
        {txtContain}
      </h5>
    </div>
  );
}
