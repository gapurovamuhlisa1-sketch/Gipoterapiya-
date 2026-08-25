import Image from "next/image";

export default function Hero() {
  return (
    <>
      <div className="glow" aria-hidden="true" />
      <div className="byline">
        <Image
          className="portrait"
          src="/instructor.jpg"
          alt="Kurs muallifi"
          width={56}
          height={56}
          priority
        />
        <div className="eyebrow">
          <span className="breath" aria-hidden="true" />
          Ichki tinchlik sari
        </div>
      </div>
      <h1>
        Gipnoterapiya <em>darsligi</em>
      </h1>
      <p className="lede">
        Nafas oling. O&apos;zingizni tinglang. Ongingiz chuqurligidagi javoblarni his
        qiling — bosqichma-bosqich, shoshilmasdan.
      </p>
    </>
  );
}
