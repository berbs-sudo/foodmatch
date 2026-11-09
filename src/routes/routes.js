import { Router } from 'express';
import { getMe, updateProfile, login, register, getUsersAndLogins } from '../controllers/authController.js';
import { getDiscoveryFeed, swipeProfile } from '../controllers/profileController.js';
import { getRestaurants, getRestaurantById } from '../controllers/restaurantController.js';
import { getMatches, getMessagesByMatch, sendMessage } from '../controllers/matchController.js';
import { getInvites, createInvite, updateInviteStatus } from '../controllers/inviteController.js';

const router = Router();

// Auth & Perfil (Banco de Dados SQLite)
router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/users', getUsersAndLogins);
router.get('/profile/me', getMe);
router.put('/profile/me', updateProfile);

// Feed de Descoberta (Swipe)
router.get('/feed', getDiscoveryFeed);
router.post('/feed/swipe', swipeProfile);

// Catálogo de Restaurantes (Módulo iFood)
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurantById);

// Matches e Chat
router.get('/matches', getMatches);
router.get('/matches/:matchId/messages', getMessagesByMatch);
router.post('/messages', sendMessage);

// Sistema de Agendamento de Encontros
router.get('/invites', getInvites);
router.post('/invites', createInvite);
router.put('/invites/:id/status', updateInviteStatus);

export default router;
