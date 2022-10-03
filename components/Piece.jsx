export default function Piece({ piece }) {
  return (
    <div
      style={{
        backgroundImage: `url(${piece.img})`,
        height: "100%",
        width: "100%",
      }}
    ></div>
  );
}
