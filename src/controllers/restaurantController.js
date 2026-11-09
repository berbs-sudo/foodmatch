import { mockRestaurants, mockCategories } from '../database/mockData.js';

export const getRestaurants = (req, res) => {
  try {
    const { categoria, busca, maxPreco, ordenarPor } = req.query;

    let results = [...mockRestaurants];

    // Filtro por Categoria (ex: Italiana, Japonesa)
    if (categoria && categoria !== 'Todas') {
      results = results.filter(r => r.categoria.toLowerCase().includes(categoria.toLowerCase()));
    }

    // Busca textual por nome ou prato do cardápio
    if (busca) {
      const term = busca.toLowerCase();
      results = results.filter(r =>
        r.nome.toLowerCase().includes(term) ||
        r.descricao.toLowerCase().includes(term) ||
        r.cardapio.some(item => item.nome.toLowerCase().includes(term))
      );
    }

    // Filtro por faixa de preço
    if (maxPreco) {
      results = results.filter(r => r.faixaPreco.length <= maxPreco.length);
    }

    // Ordenação
    if (ordenarPor === 'avaliacao') {
      results.sort((a, b) => b.avaliacao - a.avaliacao);
    } else if (ordenarPor === 'distancia') {
      results.sort((a, b) => a.distanciaKm - b.distanciaKm);
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      categoriasDisponiveis: mockCategories
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getRestaurantById = (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = mockRestaurants.find(r => r.id === parseInt(id, 10));

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurante não encontrado.' });
    }

    return res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
