import Image from "next/image";
import logoFull from "../../../public/logo/tech-abelard-full.png";
import logoMark from "../../../public/logo/tech-abelard-mark.png";

export function HeaderLogo() {
  return (
    <>
      <Image
        src={logoMark}
        alt="Tech Abélard"
        priority
        className="h-7 w-auto xl:hidden"
      />
      <Image
        src={logoFull}
        alt="Tech Abélard"
        priority
        className="hidden h-10 w-auto xl:block"
      />
    </>
  );
}
