import Link from "next/link";

export default function LinkNav({ contain, linkInput = "", customStyle }: any) {
  return (
    <li className={`text-[16px] ${customStyle}`}>
      <Link href={linkInput}>{contain}</Link>
    </li>
  );
}
