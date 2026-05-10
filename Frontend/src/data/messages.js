const stored = JSON.parse(localStorage.getItem("messages")) || [];

export const messages = stored.length
  ? stored
  : [
      {
        id: "msg1",
        senderId: "u1",
        receiverId: "u3",
        text: "Hello, I'm interested in your React service.",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
        read: true,
      },
      {
        id: "msg2",
        senderId: "u3",
        receiverId: "u1",
        text: "Hi! Sure, I'd love to help. What do you need exactly?",
        createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        read: true,
      },
      {
        id: "msg3",
        senderId: "u1",
        receiverId: "u3",
        text: "I need a landing page with Tailwind CSS.",
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        read: false,
      },
    ];

export const getMessages = () => messages;

export const getConversation = (userId1, userId2) =>
  messages.filter(
    (m) =>
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
  );


export const getConversationPartners = (userId) => {
  const partnerIds = new Set();
  messages.forEach((m) => {
    if (m.senderId === userId)   partnerIds.add(m.receiverId);
    if (m.receiverId === userId) partnerIds.add(m.senderId);
  });
  return [...partnerIds];
};

export const addMessage = ({ senderId, receiverId, text }) => {
  const newMsg = {
    id: `msg${Date.now()}`,
    senderId,
    receiverId,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(newMsg);
  localStorage.setItem("messages", JSON.stringify(messages));
  return newMsg;
};