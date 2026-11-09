import prisma from '../database/prisma.js';
import { mockUsers, mockCategories } from '../database/mockData.js';

let currentUser = { ...mockUsers[0] };

// Converte registro do Prisma para o formato esperado pelo Frontend
export const formatDbUser = (dbUser) => {
  if (!dbUser) return null;
  let fotos = [dbUser.fotoPerfil];
  try {
    if (dbUser.fotosJson) fotos = JSON.parse(dbUser.fotosJson);
  } catch {
    fotos = [dbUser.fotoPerfil];
  }

  let preferencias = [1, 2, 7];
  try {
    if (dbUser.preferenciasJson) preferencias = JSON.parse(dbUser.preferenciasJson);
  } catch {
    preferencias = [1, 2, 7];
  }

  return {
    id: dbUser.id,
    nome: dbUser.nome,
    email: dbUser.email,
    senha: dbUser.senha,
    idade: dbUser.idade,
    cidade: dbUser.cidade,
    profissao: dbUser.profissao || 'Foodie & Explorador Gastronômico',
    bio: dbUser.bio,
    fotoPerfil: dbUser.fotoPerfil,
    fotos,
    pratoFavorito: dbUser.pratoFavorito || 'Risoto de Funghi com Parmesão',
    restauranteFavorito: dbUser.restauranteFavorito || 'Trattoria Bella Napoli',
    desejoDoDia: dbUser.desejoDoDia || '🍕 Massa artesanal & Vinho tinto',
    preferencias,
    lastLoginAt: dbUser.lastLoginAt,
    createdAt: dbUser.createdAt,
  };
};

// Popula o banco SQLite caso esteja vazio (Seed automático)
export const ensureSeedDatabase = async () => {
  try {
    const catCount = await prisma.gastronomicCategory.count();
    if (catCount === 0) {
      for (const cat of mockCategories) {
        await prisma.gastronomicCategory.upsert({
          where: { nome: cat.nome },
          update: {},
          create: {
            id: cat.id,
            nome: cat.nome,
            icone: cat.icone,
          },
        });
      }
    }

    const userCount = await prisma.user.count();
    if (userCount === 0) {
      for (const u of mockUsers) {
        await prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: {
            nome: u.nome,
            email: u.email,
            senha: u.senha || '123456',
            idade: u.idade || 22,
            bio: u.bio || '',
            fotoPerfil: u.fotoPerfil,
            fotosJson: JSON.stringify(u.fotos || [u.fotoPerfil]),
            cidade: u.cidade || 'Lages - SC',
            profissao: u.profissao || 'Foodie',
            pratoFavorito: u.pratoFavorito || '',
            restauranteFavorito: u.restauranteFavorito || '',
            desejoDoDia: u.desejoDoDia || '',
            preferenciasJson: JSON.stringify(u.preferencias || [1, 2]),
            lastLoginAt: new Date(),
          },
        });
      }
      console.log('✅ Banco de dados SQLite inicializado com perfis padrão.');
    }

    const firstUser = await prisma.user.findFirst({ orderBy: { id: 'asc' } });
    if (firstUser) {
      currentUser = formatDbUser(firstUser);
    }
  } catch (err) {
    console.error('Erro ao inicializar banco de dados:', err.message);
  }
};

// Dispara seed na inicialização do módulo
ensureSeedDatabase();

export const getMe = async (req, res) => {
  try {
    if (currentUser?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: currentUser.email },
      });
      if (dbUser) {
        currentUser = formatDbUser(dbUser);
      }
    }
    return res.status(200).json({
      success: true,
      user: currentUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getUsersAndLogins = async (req, res) => {
  try {
    const dbUsers = await prisma.user.findMany({
      orderBy: { lastLoginAt: 'desc' },
    });
    const loginLogs = await prisma.loginLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { user: true },
    });

    return res.status(200).json({
      success: true,
      users: dbUsers.map(formatDbUser),
      recentLogins: loginLogs.map((log) => ({
        id: log.id,
        userId: log.userId,
        nome: log.user?.nome || log.email,
        email: log.email,
        fotoPerfil: log.user?.fotoPerfil,
        metodo: log.metodo,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      id,
      nome,
      email,
      idade,
      cidade,
      profissao,
      bio,
      fotoPerfil,
      fotos,
      pratoFavorito,
      restauranteFavorito,
      desejoDoDia,
      preferencias,
    } = req.body;

    const targetEmail = email || currentUser?.email;
    let existing = null;

    if (id && Number(id) < 1000000000) {
      existing = await prisma.user.findUnique({ where: { id: Number(id) } });
    }
    if (!existing && targetEmail) {
      existing = await prisma.user.findUnique({ where: { email: targetEmail } });
    }

    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          nome: nome ?? existing.nome,
          email: email ?? existing.email,
          idade: idade !== undefined ? Number(idade) : existing.idade,
          cidade: cidade ?? existing.cidade,
          profissao: profissao ?? existing.profissao,
          bio: bio ?? existing.bio,
          fotoPerfil: fotoPerfil ?? existing.fotoPerfil,
          fotosJson: fotos ? JSON.stringify(fotos) : existing.fotosJson,
          pratoFavorito: pratoFavorito ?? existing.pratoFavorito,
          restauranteFavorito: restauranteFavorito ?? existing.restauranteFavorito,
          desejoDoDia: desejoDoDia ?? existing.desejoDoDia,
          preferenciasJson: preferencias
            ? JSON.stringify(preferencias)
            : existing.preferenciasJson,
        },
      });
      currentUser = formatDbUser(updated);
    } else {
      currentUser = {
        ...currentUser,
        nome: nome ?? currentUser.nome,
        email: email ?? currentUser.email,
        idade: idade !== undefined ? Number(idade) : currentUser.idade,
        cidade: cidade ?? currentUser.cidade,
        profissao: profissao ?? currentUser.profissao,
        bio: bio ?? currentUser.bio,
        fotoPerfil: fotoPerfil ?? currentUser.fotoPerfil,
        fotos: fotos ?? currentUser.fotos,
        pratoFavorito: pratoFavorito ?? currentUser.pratoFavorito,
        restauranteFavorito: restauranteFavorito ?? currentUser.restauranteFavorito,
        desejoDoDia: desejoDoDia ?? currentUser.desejoDoDia,
        preferencias: preferencias ?? currentUser.preferencias,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Perfil atualizado e salvo no banco de dados com sucesso!',
      user: currentUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha, metodo = 'PASSWORD' } = req.body || {};

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Informe o e-mail para realizar o login.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Procura o usuário no banco de dados SQLite
    let dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (dbUser) {
      // Verifica senha caso o usuário tenha digitado
      if (metodo === 'PASSWORD' && dbUser.senha && senha && dbUser.senha !== senha) {
        return res.status(401).json({
          success: false,
          message: 'Senha incorreta para este usuário.',
        });
      }

      // Atualiza a data do último login no banco
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { lastLoginAt: new Date() },
      });
    } else {
      // Se não existir ainda no banco, cria e salva automaticamente no banco de dados!
      const nameFromEmail = normalizedEmail.split('@')[0].replace(/[._]/g, ' ');
      const capitalizedName = nameFromEmail
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const defaultPhoto =
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

      dbUser = await prisma.user.create({
        data: {
          nome: capitalizedName || 'Novo Usuário',
          email: normalizedEmail,
          senha: senha || '123456',
          idade: 24,
          cidade: 'Lages - SC',
          profissao: 'Foodie & Explorador Gastronômico',
          bio: 'Conectado no Mesa pra Dois! Pronto para quebrar o gelo com um mimo no iFood e dividir o primeiro date.',
          fotoPerfil: defaultPhoto,
          fotosJson: JSON.stringify([defaultPhoto]),
          pratoFavorito: 'Pizza Napolitana & Sushi',
          restauranteFavorito: 'Trattoria Bella Napoli',
          desejoDoDia: '🍕 Pizza a dois com cupom iFood',
          preferenciasJson: JSON.stringify([1, 2, 7]),
          lastLoginAt: new Date(),
        },
      });
    }

    // Registra o histórico do login na tabela historico_logins
    await prisma.loginLog.create({
      data: {
        userId: dbUser.id,
        email: dbUser.email,
        metodo: metodo || 'PASSWORD',
        ip: req.ip || '127.0.0.1',
      },
    });

    currentUser = formatDbUser(dbUser);

    return res.status(200).json({
      success: true,
      message: 'Login autenticado e salvo no banco de dados SQLite!',
      token: `jwt-token-mesapradois-${currentUser.id}`,
      user: currentUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      idade,
      cidade,
      profissao,
      bio,
      fotoPerfil,
      fotos,
      pratoFavorito,
      restauranteFavorito,
      desejoDoDia,
      preferencias,
    } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome e e-mail são obrigatórios para criar a conta.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const avatarUrl =
      fotoPerfil ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
    const userPhotos =
      Array.isArray(fotos) && fotos.length > 0 ? fotos : [avatarUrl];
    const userPrefs =
      Array.isArray(preferencias) && preferencias.length > 0
        ? preferencias
        : [1, 2, 7];

    // Upsert no banco SQLite (cria ou atualiza se o e-mail já existir)
    const dbUser = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        nome: nome.trim(),
        senha: senha || '123456',
        idade: Number(idade) || 22,
        cidade: cidade || 'Lages - SC',
        profissao: profissao || 'Foodie & Explorador Gastronômico',
        bio:
          bio ||
          'Apaixonado(a) por descobrir novos sabores, restaurantes aconchegantes e boas conversas à mesa!',
        fotoPerfil: avatarUrl,
        fotosJson: JSON.stringify(userPhotos),
        pratoFavorito: pratoFavorito || 'Risoto de Funghi com Parmesão',
        restauranteFavorito: restauranteFavorito || 'Trattoria Bella Napoli',
        desejoDoDia: desejoDoDia || '🍕 Rodízio de Massas & Vinho',
        preferenciasJson: JSON.stringify(userPrefs),
        lastLoginAt: new Date(),
      },
      create: {
        nome: nome.trim(),
        email: normalizedEmail,
        senha: senha || '123456',
        idade: Number(idade) || 22,
        cidade: cidade || 'Lages - SC',
        profissao: profissao || 'Foodie & Explorador Gastronômico',
        bio:
          bio ||
          'Apaixonado(a) por descobrir novos sabores, restaurantes aconchegantes e boas conversas à mesa!',
        fotoPerfil: avatarUrl,
        fotosJson: JSON.stringify(userPhotos),
        pratoFavorito: pratoFavorito || 'Risoto de Funghi com Parmesão',
        restauranteFavorito: restauranteFavorito || 'Trattoria Bella Napoli',
        desejoDoDia: desejoDoDia || '🍕 Rodízio de Massas & Vinho',
        preferenciasJson: JSON.stringify(userPrefs),
        lastLoginAt: new Date(),
      },
    });

    // Salva também log de cadastro/login no banco
    await prisma.loginLog.create({
      data: {
        userId: dbUser.id,
        email: dbUser.email,
        metodo: 'REGISTER',
        ip: req.ip || '127.0.0.1',
      },
    });

    currentUser = formatDbUser(dbUser);

    return res.status(201).json({
      success: true,
      message: 'Conta criada e salva no banco de dados com sucesso!',
      token: `jwt-token-mesapradois-${currentUser.id}`,
      user: currentUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
