import { mockMatches, mockUsers, mockMessages } from '../database/mockData.js';

let matchesList = [...mockMatches];
let messagesList = [...mockMessages];

export const getMatches = (req, res) => {
  try {
    const enrichedMatches = matchesList.map(m => {
      const partner = mockUsers.find(u => u.id === m.user2Id);
      const lastMsg = [...messagesList].reverse().find(msg => msg.matchId === m.id);
      return {
        ...m,
        partner,
        ultimaMensagem: lastMsg ? lastMsg.texto : 'Novo Match! Diga olá e convide para comer algo especial.'
      };
    });

    return res.status(200).json({
      success: true,
      data: enrichedMatches
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessagesByMatch = (req, res) => {
  try {
    const { matchId } = req.params;
    const msgs = messagesList.filter(m => m.matchId === parseInt(matchId, 10));

    return res.status(200).json({
      success: true,
      data: msgs
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const sendMessage = (req, res) => {
  try {
    const { matchId, texto, senderId = 1, tipo = 'TEXT', inviteId = null } = req.body;

    if (!texto) {
      return res.status(400).json({ success: false, message: 'O texto da mensagem é obrigatório.' });
    }

    const now = new Date();
    const horario = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: messagesList.length + 1,
      matchId: parseInt(matchId, 10),
      senderId: parseInt(senderId, 10),
      texto,
      tipo,
      inviteId,
      horario,
      timestamp: now.toISOString()
    };

    messagesList.push(newMsg);

    return res.status(201).json({
      success: true,
      data: newMsg
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
