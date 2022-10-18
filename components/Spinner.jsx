import Image from "next/image";
import spinner from "../public/assets/spinner.gif";

export default function Spinner() {
  return (
    <div style={{ position: "fixed" }}>
      <Image src={spinner} />
    </div>
  );
}
