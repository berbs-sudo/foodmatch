import prisma from '../database/prisma.js';
import { mockUsers, mockCategories } from '../database/mockData.js';
import { formatDbUser } from './authController.js';

let swipedUserIds = new Set();

export const getDiscoveryFeed = async (req, res) => {
  try {
    const { categoryId, currentUserId } = req.query;
    const excludeId = currentUserId ? parseInt(currentUserId, 10) : 1;

    // Carrega todos os usuários cadastrados no banco SQLite
    const dbUsers = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });

    const sourceUsers =
      dbUsers.length > 0 ? dbUsers.map(formatDbUser) : mockUsers;

    // Filtra usuários que não sejam o usuário logado
    let feed = sourceUsers.filter((u) => u.id !== excludeId);

    // Se especificado filtro por categoria
    if (categoryId) {
      const catId = parseInt(categoryId, 10);
      feed = feed.filter((u) => u.preferencias.includes(catId));
    }

    // Enriquece os dados com as categorias mapeadas
    const enrichedFeed = feed.map((u) => ({
      ...u,
      categoriasObjetos: u.preferencias
        .map((pId) => mockCategories.find((c) => c.id === pId))
        .filter(Boolean),
      compatibilidade: Math.floor(Math.random() * 20) + 80, // 80% a 99%
    }));

    return res.status(200).json({
      success: true,
      count: enrichedFeed.length,
      data: enrichedFeed,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const swipeProfile = (req, res) => {
  try {
    const { targetUserId, action } = req.body; // action: 'LIKE' | 'DISLIKE' | 'SUPERLIKE'

    if (!targetUserId || !action) {
      return res.status(400).json({ success: false, message: 'targetUserId e action são obrigatórios.' });
    }

    swipedUserIds.add(targetUserId);
    const targetUser = mockUsers.find(u => u.id === targetUserId);

    // Se a ação for LIKE ou SUPERLIKE, simulamos um Match!
    const isMatch = action === 'LIKE' || action === 'SUPERLIKE';

    return res.status(200).json({
      success: true,
      action,
      isMatch,
      targetUser,
      matchData: isMatch ? {
        matchId: Date.now(),
        user: targetUser,
        culinariasEmComum: ["Italiana", "Japonesa"],
        compatibilidade: 95
      } : null
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
