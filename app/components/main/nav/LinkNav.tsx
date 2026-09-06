import Link from "next/link";

export default function LinkNav({ contain, linkInput = "", customStyle }: any) {
  return (
    <li className={customStyle}>
      <Link href={linkInput}>{contain}</Link>
    </li>
  );
}
