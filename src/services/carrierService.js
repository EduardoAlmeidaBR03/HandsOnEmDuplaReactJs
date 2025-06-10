import supabase from './supabase';

/**
 * Serviço para gerenciar tipos de produtos com os campos id e nome
 */
const carriersService = {
  /**
   * Busca todos os tipos de produto
   * @returns {Promise<Array>} Lista de tipos de produto
   */
  async getAllCarriers() {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('Erro ao buscar transportadora:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Busca um tipo de produto pelo ID
   * @param {number|string} id - ID do tipo de produto
   * @returns {Promise<Object>} Tipo de produto encontrado
   */
  async getCarrierById(id) {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Erro ao buscar tipo de produto:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Cria um novo tipo de produto
   * @param {Object} carrier - Objeto com id e nome do tipo de produto
   * @returns {Promise<Object>} Tipo de produto criado
   */
  async createCarrier(carrier) {
    const { data, error } = await supabase
      .from('carriers')
      .insert([carrier])
      .select();
      
    if (error) {
      console.error('Erro ao criar tipo de produto:', error);
      throw error;
    }
    
    return data[0];
  },
  
  /**
   * Atualiza um tipo de produto existente
   * @param {number|string} id - ID do tipo de produto
   * @param {Object} productType - Objeto com nome atualizado do tipo de produto
   * @returns {Promise<Object>} Tipo de produto atualizado
   */
  async updateProductType(id, productType) {
    const { data, error } = await supabase
      .from('carriers')
      .update(productType)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error('Erro ao atualizar tipo de produto:', error);
      throw error;
    }
    
    return data[0];
  },
  
  /**
   * Remove um tipo de produto
   * @param {number|string} id - ID do tipo de produto
   * @returns {Promise<boolean>} Verdadeiro se removido com sucesso
   */
  async deleteProductType(id) {
    const { error } = await supabase
      .from('carriers')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao deletar tipo de produto:', error);
      throw error;
    }
    
    return true;
  }
};

export default carriersService;
