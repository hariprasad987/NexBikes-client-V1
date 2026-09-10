import Image from "next/image";

import styles from "./product-identity.module.scss";

export function ProductIdentity({ name, image }: { name: string; image: string }) {
  return <div className={styles.identity}>
    <Image alt="" height={58} src={image} width={58} />
    <span>{name}</span>
  </div>;
}
