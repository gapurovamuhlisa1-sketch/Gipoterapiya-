const STEPS = [
  "O'tmishdan kelgan og'riqlarni unutasiz",
  "Yangi pog'onaga dasturlanasiz",
  "Muammolar negizini aniqlaysiz",
  "Yechim olasiz va uni hayotingizga tadbiq qilasiz",
  "Kelajakka xohlagancha va xohlaganingizcha dastur kirita olasiz",
];

export default function Journey() {
  return (
    <ol className="journey">
      {STEPS.map((step, i) => (
        <li key={step}>
          <span className="num">{i + 1}</span>
          <p>{step}</p>
        </li>
      ))}
    </ol>
  );
}
