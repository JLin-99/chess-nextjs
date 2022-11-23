export default function ChatMessage({ message }) {
  return (
    <li>
      {message.author}: {message.message}
    </li>
  );
}
