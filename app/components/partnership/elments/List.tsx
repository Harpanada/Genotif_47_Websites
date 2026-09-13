export default function List({ txtContain }: any) {
  return (
    <div className="flex gap-0 w-full  items-center text-left">
      <li className="font-[poppins-light] text-[#74EEEE] text-sm"></li>
      <h5 className="text-sm w-full">{txtContain}</h5>
    </div>
  );
}
