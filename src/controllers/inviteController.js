import { mockInvites, mockRestaurants } from '../database/mockData.js';

let invitesList = [...mockInvites];

export const getInvites = (req, res) => {
  try {
    const { matchId } = req.query;
    let list = invitesList;

    if (matchId) {
      list = list.filter(i => i.matchId === parseInt(matchId, 10));
    }

    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createInvite = (req, res) => {
  try {
    const { matchId, restauranteId, dataEncontro, horario, mensagem, inviterId = 1, inviteeId = 2 } = req.body;

    if (!matchId || !restauranteId || !dataEncontro || !horario) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios ausentes: matchId, restauranteId, dataEncontro, horario.'
      });
    }

    const restaurant = mockRestaurants.find(r => r.id === parseInt(restauranteId, 10));

    const newInvite = {
      id: invitesList.length + 1,
      matchId: parseInt(matchId, 10),
      inviterId: parseInt(inviterId, 10),
      inviteeId: parseInt(inviteeId, 10),
      restauranteId: parseInt(restauranteId, 10),
      restauranteNome: restaurant ? restaurant.nome : 'Restaurante Escolhido',
      restauranteImagem: restaurant ? restaurant.imagemUrl : '',
      endereco: restaurant ? restaurant.endereco : 'Centro',
      dataEncontro,
      horario,
      mensagem: mensagem || 'Bora jantar e nos conhecer?',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    invitesList.push(newInvite);

    return res.status(201).json({
      success: true,
      message: 'Convite de encontro enviado com sucesso!',
      data: newInvite
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateInviteStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, novoHorario, novaData } = req.body; // status: 'ACCEPTED' | 'REJECTED' | 'RESCHEDULED'

    const inviteIndex = invitesList.findIndex(i => i.id === parseInt(id, 10));
    if (inviteIndex === -1) {
      return res.status(404).json({ success: false, message: 'Convite não encontrado.' });
    }

    invitesList[inviteIndex].status = status;
    if (novoHorario) invitesList[inviteIndex].horario = novoHorario;
    if (novaData) invitesList[inviteIndex].dataEncontro = novaData;
    invitesList[inviteIndex].updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `Status do convite alterado para ${status}`,
      data: invitesList[inviteIndex]
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
